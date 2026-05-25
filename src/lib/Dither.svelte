<script lang="ts">
	import { onMount } from 'svelte';
	import { BAYER_8, DITHER_CELL, DITHER_COLOR, DITHER_DENSITY } from '$lib/dither-pattern';

	const R = 50;
	const R2 = R * R;
	const PADDING = R;
	const K_SPRING = 10;
	const K_DAMP = 8;
	const K_ROTATE = 500;
	const K_ROTATE_PRESSED = 2000;
	const K_INWARD_PRESSED = 1000;
	const PRESS_RATE = 8;
	const DPR_CAP = 2;
	const DT = 1 / 60;
	const FAR_AWAY = 1e9;
	const TILE = 64;
	const REST_DIST2 = 0.01;
	const REST_VEL2 = 0.01;

	let canvas: HTMLCanvasElement;

	onMount(() => {
		const gl = canvas.getContext('webgl', { antialias: false, alpha: true });
		if (!gl) return;

		document.body.classList.add('dither-active');

		const [dr, dg, db] = DITHER_COLOR.map(c => c / 255);

		const vsSrc = `
			attribute vec2 aPos;
			uniform vec2 uResolution;
			uniform float uPointSize;
			void main() {
				vec2 clip = (aPos / uResolution) * 2.0 - 1.0;
				gl_Position = vec4(clip.x, -clip.y, 0.0, 1.0);
				gl_PointSize = uPointSize;
			}
		`;
		const fsSrc = `
			precision mediump float;
			uniform vec3 uColor;
			void main() {
				gl_FragColor = vec4(uColor, 1.0);
			}
		`;

		function compile(type: number, src: string) {
			const sh = gl!.createShader(type)!;
			gl!.shaderSource(sh, src);
			gl!.compileShader(sh);
			return sh;
		}
		const vs = compile(gl.VERTEX_SHADER, vsSrc);
		const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
		const prog = gl.createProgram()!;
		gl.attachShader(prog, vs);
		gl.attachShader(prog, fs);
		gl.linkProgram(prog);
		gl.useProgram(prog);

		const aPos = gl.getAttribLocation(prog, 'aPos');
		const uResolution = gl.getUniformLocation(prog, 'uResolution');
		const uPointSize = gl.getUniformLocation(prog, 'uPointSize');
		const uColor = gl.getUniformLocation(prog, 'uColor');

		const buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.enableVertexAttribArray(aPos);
		gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

		gl.uniform3f(uColor, dr, dg, db);
		gl.clearColor(0, 0, 0, 0);

		let restXY = new Float32Array(0);
		let posXY = new Float32Array(0);
		let velXY = new Float32Array(0);
		let count = 0;
		let viewW = 0;
		let viewH = 0;

		let tilesX = 0;
		let tilesY = 0;
		let numTiles = 0;
		let tileStart = new Int32Array(0);
		let tileCount = new Int32Array(0);
		let tileActive = new Uint8Array(0);
		let activeList = new Int32Array(0);
		let activeCount = 0;

		function rebuild() {
			const rect = canvas.getBoundingClientRect();
			viewW = rect.width;
			viewH = rect.height;
			const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
			canvas.width = Math.round(viewW * dpr);
			canvas.height = Math.round(viewH * dpr);
			gl!.viewport(0, 0, canvas.width, canvas.height);
			gl!.uniform2f(uResolution, viewW, viewH);
			gl!.uniform1f(uPointSize, DITHER_CELL * dpr);

			tilesX = Math.ceil((viewW + 2 * PADDING) / TILE);
			tilesY = Math.ceil((viewH + 2 * PADDING) / TILE);
			numTiles = tilesX * tilesY;

			const startCol = -Math.ceil(PADDING / DITHER_CELL);
			const endCol = Math.ceil((viewW + PADDING) / DITHER_CELL) + 1;
			const startRow = -Math.ceil(PADDING / DITHER_CELL);
			const endRow = Math.ceil((viewH + PADDING) / DITHER_CELL) + 1;

			const bucketsByTile: number[][] = Array.from({ length: numTiles }, () => []);
			let total = 0;
			for (let r = startRow; r < endRow; r++) {
				const br = ((r % 8) + 8) % 8;
				for (let c = startCol; c < endCol; c++) {
					const bc = ((c % 8) + 8) % 8;
					if (BAYER_8[br][bc] >= DITHER_DENSITY) continue;
					const x = c * DITHER_CELL + DITHER_CELL / 2;
					const y = r * DITHER_CELL + DITHER_CELL / 2;
					const tc = Math.max(0, Math.min(Math.floor((x + PADDING) / TILE), tilesX - 1));
					const tr = Math.max(0, Math.min(Math.floor((y + PADDING) / TILE), tilesY - 1));
					bucketsByTile[tr * tilesX + tc].push(x, y);
					total++;
				}
			}

			count = total;
			restXY = new Float32Array(count * 2);
			tileStart = new Int32Array(numTiles);
			tileCount = new Int32Array(numTiles);
			let acc = 0;
			for (let t = 0; t < numTiles; t++) {
				const bucket = bucketsByTile[t];
				tileStart[t] = acc;
				tileCount[t] = bucket.length / 2;
				restXY.set(bucket, acc * 2);
				acc += bucket.length / 2;
			}
			posXY = new Float32Array(restXY);
			velXY = new Float32Array(count * 2);

			tileActive = new Uint8Array(numTiles);
			activeList = new Int32Array(numTiles);
			activeCount = 0;

			gl!.bindBuffer(gl!.ARRAY_BUFFER, buffer);
			gl!.bufferData(gl!.ARRAY_BUFFER, posXY.byteLength, gl!.DYNAMIC_DRAW);
			gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, posXY);
			gl!.clear(gl!.COLOR_BUFFER_BIT);
			gl!.drawArrays(gl!.POINTS, 0, count);
		}

		rebuild();

		let mouseX = FAR_AWAY;
		let mouseY = FAR_AWAY;
		let raf = 0;

		let pressTarget = 0;
		let pressFrom = 0;
		let pressTime = performance.now();
		function getPressLevel() {
			const dt = (performance.now() - pressTime) / 1000;
			return pressTarget + (pressFrom - pressTarget) * Math.exp(-PRESS_RATE * dt);
		}
		function setPressTarget(target: number) {
			if (target === pressTarget) return;
			pressFrom = getPressLevel();
			pressTarget = target;
			pressTime = performance.now();
		}

		const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

		const occluder = document.querySelector('.frame') as HTMLElement | null;
		let occL = 0, occT = 0, occR = 0, occB = 0;
		function updateOccluder() {
			if (!occluder) { occL = occT = occR = occB = 0; return; }
			const r = occluder.getBoundingClientRect();
			occL = r.left; occT = r.top; occR = r.right; occB = r.bottom;
		}
		updateOccluder();

		function mouseDeepInOccluder() {
			return (
				occR - occL > 2 * R &&
				occB - occT > 2 * R &&
				mouseX >= occL + R && mouseX <= occR - R &&
				mouseY >= occT + R && mouseY <= occB - R
			);
		}

		function activatePointerTiles(occluded = mouseDeepInOccluder()) {
			if (mouseX === FAR_AWAY || occluded) return;
			const minC = Math.max(0, Math.floor((mouseX - R + PADDING) / TILE));
			const maxC = Math.min(tilesX - 1, Math.floor((mouseX + R + PADDING) / TILE));
			const minR = Math.max(0, Math.floor((mouseY - R + PADDING) / TILE));
			const maxR = Math.min(tilesY - 1, Math.floor((mouseY + R + PADDING) / TILE));
			if (minC > maxC || minR > maxR) return;
			for (let r = minR; r <= maxR; r++) {
				for (let c = minC; c <= maxC; c++) {
					const t = r * tilesX + c;
					if (!tileActive[t]) {
						tileActive[t] = 1;
						activeList[activeCount++] = t;
					}
				}
			}
		}

		function onPointerMove(e: PointerEvent) {
			mouseX = e.clientX;
			mouseY = e.clientY;
			activatePointerTiles();
			if (raf === 0 && activeCount > 0) {
				raf = requestAnimationFrame(frame);
			}
		}
		function isOnBackground(target: EventTarget | null) {
			return !(occluder && target instanceof Node && occluder.contains(target));
		}
		function onPointerDown(e: PointerEvent) {
			mouseX = e.clientX;
			mouseY = e.clientY;
			if (isOnBackground(e.target)) {
				setPressTarget(1);
			}
			activatePointerTiles();
			if (raf === 0 && activeCount > 0) {
				raf = requestAnimationFrame(frame);
			}
		}
		function onPointerUp() {
			setPressTarget(0);
		}
		function onPointerLeave() {
			mouseX = FAR_AWAY;
			mouseY = FAR_AWAY;
			setPressTarget(0);
		}

		const ro = new ResizeObserver(() => { rebuild(); updateOccluder(); });
		ro.observe(document.documentElement);

		window.addEventListener('scroll', updateOccluder, { passive: true });

		const move = onPointerMove as EventListener;
		const down = onPointerDown as EventListener;
		const up = onPointerUp as EventListener;
		const leave = onPointerLeave as EventListener;
		const pointerListeners: [EventTarget, string, EventListener][] = reducedMotion ? [] : [
			[window, 'pointermove', move],
			[window, 'pointerdown', down],
			[window, 'pointerup', up],
			[window, 'pointercancel', leave],
			[document.documentElement, 'pointerleave', leave],
		];
		for (const [target, name, handler] of pointerListeners) {
			target.addEventListener(name, handler, { passive: true });
		}

		function frame() {
			const occluded = mouseDeepInOccluder();
			activatePointerTiles(occluded);

			const mx = occluded ? FAR_AWAY : mouseX;
			const my = occluded ? FAR_AWAY : mouseY;
			const p = getPressLevel();
			const curK = K_ROTATE + (K_ROTATE_PRESSED - K_ROTATE) * p;
			const curInward = K_INWARD_PRESSED * p;
			let writeIdx = 0;

			for (let i = 0; i < activeCount; i++) {
				const t = activeList[i];
				const s = tileStart[t];
				const n = tileCount[t];
				if (n === 0) {
					tileActive[t] = 0;
					continue;
				}

				const tc = t % tilesX;
				const tr = (t - tc) / tilesX;
				const tx0 = tc * TILE - PADDING;
				const ty0 = tr * TILE - PADDING;
				const tx1 = tx0 + TILE;
				const ty1 = ty0 + TILE;
				const influenced =
					mx !== FAR_AWAY &&
					mx + R >= tx0 && mx - R <= tx1 &&
					my + R >= ty0 && my - R <= ty1;

				let tileSettled = true;

				for (let d = s; d < s + n; d++) {
					const ix = d * 2;
					const iy = ix + 1;
					const px = posXY[ix];
					const py = posXY[iy];
					const rx = restXY[ix];
					const ry = restXY[iy];
					const vx = velXY[ix];
					const vy = velXY[iy];

					const dx = px - rx;
					const dy = py - ry;

					let fx = -K_SPRING * dx - K_DAMP * vx;
					let fy = -K_SPRING * dy - K_DAMP * vy;

					if (influenced) {
						const mdx = px - mx;
						const mdy = py - my;
						const dist2 = mdx * mdx + mdy * mdy;
						if (dist2 < R2) {
							const falloff = 1 - dist2 / R2;
							const invD = 1 / Math.sqrt(dist2 + 1e-4);
							const rot = curK * falloff;
							const inward = curInward * falloff;
							fx += -mdy * invD * rot - mdx * invD * inward;
							fy += mdx * invD * rot - mdy * invD * inward;
						}
					}

					const nvx = vx + fx * DT;
					const nvy = vy + fy * DT;
					const nx = px + nvx * DT;
					const ny = py + nvy * DT;

					velXY[ix] = nvx;
					velXY[iy] = nvy;
					posXY[ix] = nx;
					posXY[iy] = ny;

					const ndx = nx - rx;
					const ndy = ny - ry;
					if (ndx * ndx + ndy * ndy >= REST_DIST2 || nvx * nvx + nvy * nvy >= REST_VEL2) {
						tileSettled = false;
					}
				}

				const byteOffset = s * 2 * 4;
				const slice = posXY.subarray(s * 2, (s + n) * 2);

				if (influenced || !tileSettled) {
					activeList[writeIdx++] = t;
				} else {
					const begin = s * 2;
					const end = (s + n) * 2;
					posXY.set(restXY.subarray(begin, end), begin);
					velXY.fill(0, begin, end);
					tileActive[t] = 0;
				}
				gl!.bufferSubData(gl!.ARRAY_BUFFER, byteOffset, slice);
			}

			activeCount = writeIdx;

			gl!.clear(gl!.COLOR_BUFFER_BIT);
			gl!.drawArrays(gl!.POINTS, 0, count);

			if (activeCount > 0) {
				raf = requestAnimationFrame(frame);
			} else {
				raf = 0;
			}
		}

		return () => {
			cancelAnimationFrame(raf);
			ro.disconnect();
			for (const [target, name, handler] of pointerListeners) {
				target.removeEventListener(name, handler);
			}
			window.removeEventListener('scroll', updateOccluder);
			document.body.classList.remove('dither-active');
		};
	});
</script>

<canvas bind:this={canvas} aria-hidden="true"></canvas>

<style>
	canvas {
		position: fixed;
		inset: 0;
		width: 100vw;
		height: 100vh;
		z-index: -1;
		pointer-events: none;
		display: block;
	}
</style>
