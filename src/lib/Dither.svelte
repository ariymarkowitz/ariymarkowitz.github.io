<script lang="ts">
	import { onMount } from 'svelte';

	const GRID = 1.5;
	const DOT_SIZE = 1.5;
	const DENSITY = 9;
	const R = 20;
	const R2 = R * R;
	const K_SPRING = 10;
	const K_DAMP = 8;
	const K_REPEL = 800;
	const DPR_CAP = 2;
	const DT = 1 / 60;
	const FAR_AWAY = 1e9;
	const TILE = 64;
	const REST_DIST2 = 0.01;
	const REST_VEL2 = 0.01;

	const BAYER_8 = [
		[ 0, 32,  8, 40,  2, 34, 10, 42],
		[48, 16, 56, 24, 50, 18, 58, 26],
		[12, 44,  4, 36, 14, 46,  6, 38],
		[60, 28, 52, 20, 62, 30, 54, 22],
		[ 3, 35, 11, 43,  1, 33,  9, 41],
		[51, 19, 59, 27, 49, 17, 57, 25],
		[15, 47,  7, 39, 13, 45,  5, 37],
		[63, 31, 55, 23, 61, 29, 53, 21],
	];

	let canvas: HTMLCanvasElement;

	function parseRgb(s: string): [number, number, number] {
		const m = s.match(/\d+(\.\d+)?/g);
		if (!m || m.length < 3) return [0, 0, 0];
		return [parseFloat(m[0]) / 255, parseFloat(m[1]) / 255, parseFloat(m[2]) / 255];
	}

	onMount(() => {
		const gl = canvas.getContext('webgl', { antialias: false, alpha: false, premultipliedAlpha: false });
		if (!gl) return;

		document.body.classList.add('dither-active');

		const cssVars = getComputedStyle(document.documentElement);
		const [br, bg, bb] = parseRgb(cssVars.getPropertyValue('--bg'));
		const [dr, dg, db] = parseRgb(cssVars.getPropertyValue('--dither'));

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
		gl.clearColor(br, bg, bb, 1);

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
			viewW = window.innerWidth;
			viewH = window.innerHeight;
			const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
			canvas.width = Math.round(viewW * dpr);
			canvas.height = Math.round(viewH * dpr);
			canvas.style.width = viewW + 'px';
			canvas.style.height = viewH + 'px';
			gl!.viewport(0, 0, canvas.width, canvas.height);
			gl!.uniform2f(uResolution, viewW, viewH);
			gl!.uniform1f(uPointSize, DOT_SIZE * dpr);

			tilesX = Math.ceil(viewW / TILE);
			tilesY = Math.ceil(viewH / TILE);
			numTiles = tilesX * tilesY;

			const cols = Math.ceil(viewW / GRID) + 1;
			const rows = Math.ceil(viewH / GRID) + 1;

			// Pass 1: count dots per tile.
			tileCount = new Int32Array(numTiles);
			let total = 0;
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					if (BAYER_8[r % 8][c % 8] < DENSITY) {
						const x = c * GRID + GRID / 2;
						const y = r * GRID + GRID / 2;
						const tc = Math.min(Math.floor(x / TILE), tilesX - 1);
						const tr = Math.min(Math.floor(y / TILE), tilesY - 1);
						tileCount[tr * tilesX + tc]++;
						total++;
					}
				}
			}
			count = total;

			// Prefix sum -> tileStart.
			tileStart = new Int32Array(numTiles);
			let acc = 0;
			for (let t = 0; t < numTiles; t++) {
				tileStart[t] = acc;
				acc += tileCount[t];
			}

			// Pass 2: place each dot into its tile's slot.
			restXY = new Float32Array(count * 2);
			const cursor = new Int32Array(numTiles);
			for (let r = 0; r < rows; r++) {
				for (let c = 0; c < cols; c++) {
					if (BAYER_8[r % 8][c % 8] < DENSITY) {
						const x = c * GRID + GRID / 2;
						const y = r * GRID + GRID / 2;
						const tc = Math.min(Math.floor(x / TILE), tilesX - 1);
						const tr = Math.min(Math.floor(y / TILE), tilesY - 1);
						const t = tr * tilesX + tc;
						const idx = tileStart[t] + cursor[t]++;
						restXY[idx * 2] = x;
						restXY[idx * 2 + 1] = y;
					}
				}
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

		const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

		function activatePointerTiles() {
			if (mouseX === FAR_AWAY) return;
			const minC = Math.max(0, Math.floor((mouseX - R) / TILE));
			const maxC = Math.min(tilesX - 1, Math.floor((mouseX + R) / TILE));
			const minR = Math.max(0, Math.floor((mouseY - R) / TILE));
			const maxR = Math.min(tilesY - 1, Math.floor((mouseY + R) / TILE));
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
		function onPointerLeave() {
			mouseX = FAR_AWAY;
			mouseY = FAR_AWAY;
		}

		const ro = new ResizeObserver(() => rebuild());
		ro.observe(document.documentElement);

		if (!reducedMotion) {
			window.addEventListener('pointermove', onPointerMove, { passive: true });
			window.addEventListener('pointerdown', onPointerMove, { passive: true });
			window.addEventListener('pointercancel', onPointerLeave, { passive: true });
			document.addEventListener('pointerleave', onPointerLeave, { passive: true });
		}

		function frame() {
			activatePointerTiles();

			const mx = mouseX;
			const my = mouseY;
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
				const tx0 = tc * TILE;
				const ty0 = tr * TILE;
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
							const f = K_REPEL * falloff;
							fx += mdx * invD * f;
							fy += mdy * invD * f;
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
					gl!.bufferSubData(gl!.ARRAY_BUFFER, byteOffset, slice);
				} else {
					// Snap to exact rest, upload final state, deactivate.
					for (let d = s; d < s + n; d++) {
						const ix = d * 2;
						const iy = ix + 1;
						posXY[ix] = restXY[ix];
						posXY[iy] = restXY[iy];
						velXY[ix] = 0;
						velXY[iy] = 0;
					}
					gl!.bufferSubData(gl!.ARRAY_BUFFER, byteOffset, slice);
					tileActive[t] = 0;
				}
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
			window.removeEventListener('pointermove', onPointerMove);
			window.removeEventListener('pointerdown', onPointerMove);
			window.removeEventListener('pointercancel', onPointerLeave);
			document.removeEventListener('pointerleave', onPointerLeave);
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
