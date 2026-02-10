import React, { useEffect, useRef } from 'react';
import { useTheme } from 'styled-components';

function clamp(min, value, max) {
  return Math.min(max, Math.max(min, value));
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true;
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;
}

const MAX_RIPPLE_POINTS = 40;
const RIPPLE_CONFIG = Object.freeze({
  dprMax: 1.2,
  trailSpacingMobile: 0.015,
  trailSpacingDesktop: 0.011,
  displacementMobile: 0.027,
  displacementDesktop: 0.022,
  aberration: 0.58,
  radiusMobile: 0.114,
  radiusDesktop: 0.088,
  radiusJitter: 0.018,
  radiusExpand: 0.43,
  radiusMax: 0.255,
  amplitudeScale: 1.02,
  motionScale: 27,
  tapBoost: 1.08,
  waveFrequency: 45,
  waveSpeed: 15.3,
  ageDecay: 2,
  swirl: 0.22,
  velocityScale: 0.18,
  velocityDamping: 7.05,
  amplitudeDamping: 2.08,
  impulseDecay: 5,
  idleThreshold: 0.0074
});

const VERTEX_SHADER_SOURCE = `#version 300 es
layout(location = 0) in vec2 a_position;
out vec2 v_uv;

void main() {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const RENDER_SHADER_SOURCE = `#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_source;
uniform vec2 u_points[${MAX_RIPPLE_POINTS}];
uniform vec4 u_waves[${MAX_RIPPLE_POINTS}];
uniform int u_pointCount;
uniform float u_strength;
uniform float u_aberration;
uniform float u_frequency;
uniform float u_speed;
uniform float u_decay;
uniform float u_swirl;
uniform float u_aspect;
uniform float u_time;

vec2 computeRippleOffset(vec2 uv) {
  vec2 offset = vec2(0.0);

  for (int i = 0; i < ${MAX_RIPPLE_POINTS}; i += 1) {
    if (i >= u_pointCount) break;

    vec2 center = u_points[i];
    vec4 wave = u_waves[i];
    float amplitude = wave.x;
    float radius = max(0.0008, wave.y);
    float age = wave.z;
    float phaseOffset = wave.w;

    vec2 delta = uv - center;
    delta.x *= u_aspect;

    float dist = length(delta);
    vec2 dir = delta / max(dist, 0.0004);
    vec2 tangent = vec2(-dir.y, dir.x);

    float envelope = exp(-(dist * dist) / (radius * radius));
    float ageFade = exp(-age * u_decay);
    float phase = dist * u_frequency - age * u_speed + phaseOffset;

    float ring = sin(phase);
    float swirl = cos(phase * 0.86 + (u_time * 0.35) + phaseOffset);

    offset += dir * (ring * amplitude * envelope * ageFade);
    offset += tangent * (swirl * amplitude * envelope * ageFade * u_swirl);
  }

  return offset;
}

void main() {
  vec2 offset = computeRippleOffset(v_uv) * u_strength;
  vec2 uvA = clamp(v_uv + offset, vec2(0.001), vec2(0.999));
  vec2 uvB = clamp(v_uv + offset * 0.62, vec2(0.001), vec2(0.999));

  vec3 color = mix(texture(u_source, uvA).rgb, texture(u_source, uvB).rgb, 0.22);

  if (u_aberration > 0.0) {
    vec2 shift = offset * u_aberration;
    float r = texture(u_source, clamp(uvA + shift, vec2(0.001), vec2(0.999))).r;
    float b = texture(u_source, clamp(uvA - shift, vec2(0.001), vec2(0.999))).b;
    color = vec3(r, color.g, b);
  }

  outColor = vec4(color, 1.0);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Failed to create shader.');
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) || 'Unknown shader compile error.';
    gl.deleteShader(shader);
    throw new Error(info);
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) {
    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
    throw new Error('Failed to create program.');
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) || 'Unknown program link error.';
    gl.deleteProgram(program);
    throw new Error(info);
  }
  return program;
}

function createTexture(gl, width, height, data = null, options = {}) {
  const {
    internalFormat = gl.RGBA,
    format = gl.RGBA,
    type = gl.UNSIGNED_BYTE,
    minFilter = gl.LINEAR,
    magFilter = gl.LINEAR
  } = options;
  const texture = gl.createTexture();
  if (!texture) throw new Error('Failed to create texture.');
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    internalFormat,
    width,
    height,
    0,
    format,
    type,
    data,
  );
  return texture;
}

function parseNumericPx(value) {
  if (!value || value === 'normal') return null;
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function fillRadialEllipse(ctx, cx, cy, rx, ry, stops) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(rx / Math.max(1, ry), 1);
  const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, ry);
  stops.forEach(([stop, color]) => gradient.addColorStop(stop, color));
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(0, 0, ry, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function toCanvasFont(style, fallbackFamily = 'sans-serif') {
  const fontStyle = style?.fontStyle && style.fontStyle !== 'normal' ? style.fontStyle : '';
  const fontWeight = style?.fontWeight || '400';
  const fontSize = parseNumericPx(style?.fontSize) ?? 16;
  const fontFamily = style?.fontFamily || fallbackFamily;
  return `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`.trim();
}

function drawTextWithLetterSpacing(ctx, text, x, y, letterSpacingPx = 0) {
  if (!text) return;
  const spacing = Number.isFinite(letterSpacingPx) ? letterSpacingPx : 0;

  if (Math.abs(spacing) < 0.01) {
    ctx.fillText(text, x, y);
    return;
  }

  let cursorX = x;
  Array.from(text).forEach((glyph) => {
    ctx.fillText(glyph, cursorX, y);
    cursorX += ctx.measureText(glyph).width + spacing;
  });
}

function getTextNodeLineBoxes(textNode) {
  if (
    typeof document === 'undefined' ||
    !textNode ||
    textNode.nodeType !== Node.TEXT_NODE
  ) {
    return [];
  }

  const text = textNode.textContent || '';
  if (!text) return [];

  const range = document.createRange();
  const boxes = [];
  let current = null;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    range.setStart(textNode, i);
    range.setEnd(textNode, i + 1);
    const rect = range.getBoundingClientRect();
    if (!rect || (rect.width === 0 && rect.height === 0)) {
      if (/\s/u.test(char) && current) {
        current.text += char;
      }
      continue;
    }

    const top = Math.round(rect.top * 2) / 2;
    if (!current || Math.abs(top - current.top) > 1) {
      current = {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        text: char
      };
      boxes.push(current);
      continue;
    }

    current.left = Math.min(current.left, rect.left);
    current.right = Math.max(current.right, rect.right);
    current.text += char;
  }

  range.detach?.();
  return boxes;
}

function destroyResources(gl, resources) {
  if (!gl || !resources) return;
  if (resources.sourceTexture) gl.deleteTexture(resources.sourceTexture);
  if (resources.renderProgram) gl.deleteProgram(resources.renderProgram);
  if (resources.quadBuffer) gl.deleteBuffer(resources.quadBuffer);
  if (resources.quadVao) gl.deleteVertexArray(resources.quadVao);
}

function createInitialPointerState() {
  return {
    active: false,
    inside: false,
    x: 0.5,
    y: 0.5,
    dx: 0,
    dy: 0,
    impulse: 0,
    type: 'mouse',
    emitX: 0.5,
    emitY: 0.5,
    hasEmit: false
  };
}

function createInitialLastFrameState() {
  return { t: 0, w: 0, h: 0, dpr: 1 };
}

export default function HeroStableFluids({
  className,
  titlePrefix = "Hi, I'm ",
  titleHighlight = 'Yu Xuan',
  subtitle = '',
  kickerRef,
  subtitleRef,
  onReady
}) {
  const theme = useTheme();
  const canvasRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(0);
  const resizeObserverRef = useRef(null);
  const intersectionObserverRef = useRef(null);
  const visibilityHandlerRef = useRef(null);
  const inViewRef = useRef(true);
  const readyRef = useRef(false);
  const activityRef = useRef(0);
  const rippleRef = useRef([]);
  const timeRef = useRef(0);
  const lastRef = useRef(createInitialLastFrameState());
  const pointerRef = useRef(createInitialPointerState());

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    if (prefersReducedMotion()) return undefined;

    const rippleConfig = RIPPLE_CONFIG;
    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: 'high-performance'
    });
    if (!gl) return undefined;

    let resources = null;
    try {
      const renderProgram = createProgram(gl, VERTEX_SHADER_SOURCE, RENDER_SHADER_SOURCE);

      const quadBuffer = gl.createBuffer();
      if (!quadBuffer) throw new Error('Failed to create quad buffer.');
      gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([
          -1, -1,
          1, -1,
          -1, 1,
          1, 1
        ]),
        gl.STATIC_DRAW,
      );

      const quadVao = gl.createVertexArray();
      if (!quadVao) throw new Error('Failed to create VAO.');
      gl.bindVertexArray(quadVao);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      gl.bindVertexArray(null);

      resources = {
        renderProgram,
        quadBuffer,
        quadVao,
        sourceTexture: createTexture(gl, 1, 1, new Uint8Array([0, 0, 0, 255]), {
          internalFormat: gl.RGBA,
          format: gl.RGBA,
          type: gl.UNSIGNED_BYTE
        }),
        pointData: new Float32Array(MAX_RIPPLE_POINTS * 2),
        waveData: new Float32Array(MAX_RIPPLE_POINTS * 4),
        uniforms: {
          render: {
            source: gl.getUniformLocation(renderProgram, 'u_source'),
            points: gl.getUniformLocation(renderProgram, 'u_points[0]'),
            waves: gl.getUniformLocation(renderProgram, 'u_waves[0]'),
            pointCount: gl.getUniformLocation(renderProgram, 'u_pointCount'),
            strength: gl.getUniformLocation(renderProgram, 'u_strength'),
            aberration: gl.getUniformLocation(renderProgram, 'u_aberration'),
            frequency: gl.getUniformLocation(renderProgram, 'u_frequency'),
            speed: gl.getUniformLocation(renderProgram, 'u_speed'),
            decay: gl.getUniformLocation(renderProgram, 'u_decay'),
            swirl: gl.getUniformLocation(renderProgram, 'u_swirl'),
            aspect: gl.getUniformLocation(renderProgram, 'u_aspect'),
            time: gl.getUniformLocation(renderProgram, 'u_time')
          }
        }
      };
    } catch (error) {
      console.error(error);
      destroyResources(gl, resources);
      return undefined;
    }

    const sourceCanvas = document.createElement('canvas');
    const sourceCtx = sourceCanvas.getContext('2d', { alpha: false });
    if (!sourceCtx) {
      destroyResources(gl, resources);
      return undefined;
    }
    sourceRef.current = { canvas: sourceCanvas, ctx: sourceCtx };

    const bindQuadAndDraw = () => {
      gl.bindVertexArray(resources.quadVao);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      gl.bindVertexArray(null);
    };

    const drawHeroBackground = (drawCtx, width, height) => {
      const isLightMode = theme?.mode === 'light';

      const base = drawCtx.createLinearGradient(0, 0, 0, height);
      if (isLightMode) {
        base.addColorStop(0, 'rgb(233, 240, 241)');
        base.addColorStop(0.62, 'rgb(224, 233, 235)');
        base.addColorStop(1, 'rgb(215, 226, 228)');
      } else {
        base.addColorStop(0, 'rgb(13, 14, 35)');
        base.addColorStop(0.62, 'rgb(9, 11, 30)');
        base.addColorStop(1, 'rgb(3, 8, 19)');
      }
      drawCtx.fillStyle = base;
      drawCtx.fillRect(0, 0, width, height);

      if (isLightMode) {
        fillRadialEllipse(
          drawCtx,
          width * 0.88,
          height * 0.12,
          width * 0.55,
          height * 0.44,
          [
            [0, 'rgba(123, 170, 214, 0.2)'],
            [0.74, 'rgba(123, 170, 214, 0)']
          ],
        );

        fillRadialEllipse(
          drawCtx,
          width * 0.1,
          height * 0.1,
          width * 0.55,
          height * 0.44,
          [
            [0, 'rgba(60, 197, 194, 0.16)'],
            [0.74, 'rgba(60, 197, 194, 0)']
          ],
        );

        fillRadialEllipse(
          drawCtx,
          width * 0.5,
          height * 0.46,
          width * 0.92,
          height * 0.6,
          [
            [0, 'rgba(160, 202, 232, 0.38)'],
            [0.34, 'rgba(196, 222, 239, 0.28)'],
            [0.56, 'rgba(223, 234, 236, 0.14)'],
            [0.74, 'rgba(223, 234, 236, 0)']
          ],
        );

        return;
      }

      fillRadialEllipse(
        drawCtx,
        width * 0.88,
        height * 0.12,
        width * 0.55,
        height * 0.44,
        [
          [0, 'rgba(84, 164, 224, 0.14)'],
          [0.74, 'rgba(84, 164, 224, 0)']
        ],
      );

      fillRadialEllipse(
        drawCtx,
        width * 0.1,
        height * 0.1,
        width * 0.55,
        height * 0.44,
        [
          [0, 'rgba(46, 99, 183, 0.2)'],
          [0.74, 'rgba(46, 99, 183, 0)']
        ],
      );

      fillRadialEllipse(
        drawCtx,
        width * 0.5,
        height * 0.46,
        width * 0.92,
        height * 0.6,
        [
          [0, 'rgba(126, 89, 212, 0.34)'],
          [0.34, 'rgba(80, 55, 164, 0.24)'],
          [0.56, 'rgba(30, 28, 65, 0.1)'],
          [0.74, 'rgba(6, 12, 26, 0)']
        ],
      );
    };

    const uploadSourceTexture = () => {
      const source = sourceRef.current;
      if (!source) return;
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, resources.sourceTexture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source.canvas,
      );
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
    };

    const redrawSource = () => {
      const { w, h, dpr } = lastRef.current;
      const source = sourceRef.current;
      if (!source || w <= 0 || h <= 0) return;

      source.canvas.width = Math.max(1, Math.floor(w * dpr));
      source.canvas.height = Math.max(1, Math.floor(h * dpr));
      source.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      source.ctx.imageSmoothingEnabled = true;
      source.ctx.imageSmoothingQuality = 'high';
      source.ctx.clearRect(0, 0, w, h);
      drawHeroBackground(source.ctx, w, h);

      const kickerEl = kickerRef?.current;
      const subtitleEl = subtitleRef?.current;
      const canvasRect = canvas.getBoundingClientRect();

      if (kickerEl && canvasRect.width > 0) {
        const kickerStyle = window.getComputedStyle(kickerEl);
        const fontFamily = kickerStyle.fontFamily || "'Red Hat Display', sans-serif";
        const color = theme?.text?.primary || kickerStyle.color || '#EFF4FF';
        const letterSpacing = parseNumericPx(kickerStyle.letterSpacing) ?? 0;

        source.ctx.save();
        source.ctx.textBaseline = 'top';
        source.ctx.textAlign = 'left';
        source.ctx.font = toCanvasFont(kickerStyle, fontFamily);
        source.ctx.fillStyle = color;

        const textNodes = Array.from(kickerEl.childNodes).filter(
          (node) => node.nodeType === Node.TEXT_NODE,
        );
        const prefixNode = textNodes[0] || null;
        const highlightEl = kickerEl.querySelector('span');
        const prefixBoxes = getTextNodeLineBoxes(prefixNode);

        if (prefixBoxes.length > 0) {
          prefixBoxes.forEach((box) => {
            drawTextWithLetterSpacing(
              source.ctx,
              box.text,
              box.left - canvasRect.left,
              box.top - canvasRect.top,
              letterSpacing,
            );
          });
        } else {
          const kickerRect = kickerEl.getBoundingClientRect();
          drawTextWithLetterSpacing(
            source.ctx,
            titlePrefix,
            kickerRect.left - canvasRect.left,
            kickerRect.top - canvasRect.top,
            letterSpacing,
          );
        }

        if (highlightEl) {
          const highlightStyle = window.getComputedStyle(highlightEl);
          const highlightLetterSpacing =
            parseNumericPx(highlightStyle.letterSpacing) ?? letterSpacing;
          source.ctx.font = toCanvasFont(highlightStyle, fontFamily);

          const highlightNode = Array.from(highlightEl.childNodes).find(
            (node) => node.nodeType === Node.TEXT_NODE,
          );
          const highlightBoxes = getTextNodeLineBoxes(highlightNode);

          if (highlightBoxes.length > 0) {
            highlightBoxes.forEach((box) => {
              const x = box.left - canvasRect.left;
              const y = box.top - canvasRect.top;
              const width = Math.max(1, box.right - box.left);
              const gradient = source.ctx.createLinearGradient(x, y, x + width, y);
              gradient.addColorStop(0, theme?.accent || '#3BC5C2');
              gradient.addColorStop(1, theme?.accentAlt || '#2E63B7');
              source.ctx.fillStyle = gradient;
              drawTextWithLetterSpacing(
                source.ctx,
                box.text,
                x,
                y,
                highlightLetterSpacing,
              );
            });
          } else {
            const highlightRect = highlightEl.getBoundingClientRect();
            const x = highlightRect.left - canvasRect.left;
            const y = highlightRect.top - canvasRect.top;
            const width = Math.max(1, highlightRect.width);
            const gradient = source.ctx.createLinearGradient(x, y, x + width, y);
            gradient.addColorStop(0, theme?.accent || '#3BC5C2');
            gradient.addColorStop(1, theme?.accentAlt || '#2E63B7');
            source.ctx.fillStyle = gradient;
            drawTextWithLetterSpacing(
              source.ctx,
              titleHighlight,
              x,
              y,
              highlightLetterSpacing,
            );
          }
        }

        source.ctx.restore();
      }

      if (subtitleEl && canvasRect.width > 0) {
        const subtitleRect = subtitleEl.getBoundingClientRect();
        const subtitleStyle = window.getComputedStyle(subtitleEl);
        const fontSize = parseNumericPx(subtitleStyle.fontSize) ?? 18;
        const fontWeight = subtitleStyle.fontWeight || '400';
        const fontFamily = subtitleStyle.fontFamily || "'Red Hat Display', sans-serif";
        const color = theme?.text?.secondary || subtitleStyle.color || 'rgba(215, 226, 241, 0.82)';
        const subtitleNode = Array.from(subtitleEl.childNodes).find(
          (node) => node.nodeType === Node.TEXT_NODE,
        );
        const subtitleBoxes = getTextNodeLineBoxes(subtitleNode);

        source.ctx.save();
        source.ctx.textBaseline = 'top';
        source.ctx.textAlign = 'left';
        source.ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        source.ctx.fillStyle = color;

        if (subtitleBoxes.length > 0) {
          subtitleBoxes.forEach((box) => {
            drawTextWithLetterSpacing(
              source.ctx,
              box.text,
              box.left - canvasRect.left,
              box.top - canvasRect.top,
              0,
            );
          });
        } else {
          drawTextWithLetterSpacing(
            source.ctx,
            subtitle,
            subtitleRect.left - canvasRect.left,
            subtitleRect.top - canvasRect.top,
            0,
          );
        }
        source.ctx.restore();
      }

      uploadSourceTexture();
    };

    const renderFrame = () => {
      const width = lastRef.current.w;
      const height = lastRef.current.h;
      if (width <= 0 || height <= 0) return;

      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(resources.renderProgram);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, resources.sourceTexture);
      gl.uniform1i(resources.uniforms.render.source, 0);

      const ripples = rippleRef.current;
      const renderCount = Math.min(ripples.length, MAX_RIPPLE_POINTS);
      const startIndex = Math.max(0, ripples.length - renderCount);

      resources.pointData.fill(0);
      resources.waveData.fill(0);

      for (let i = 0; i < renderCount; i += 1) {
        const ripple = ripples[startIndex + i];
        const pointOffset = i * 2;
        const waveOffset = i * 4;
        resources.pointData[pointOffset] = clamp(0, ripple.x, 1);
        resources.pointData[pointOffset + 1] = clamp(0, ripple.y, 1);
        resources.waveData[waveOffset] = ripple.amplitude;
        resources.waveData[waveOffset + 1] = ripple.radius;
        resources.waveData[waveOffset + 2] = ripple.age;
        resources.waveData[waveOffset + 3] = ripple.phase;
      }

      gl.uniform2fv(resources.uniforms.render.points, resources.pointData);
      gl.uniform4fv(resources.uniforms.render.waves, resources.waveData);
      gl.uniform1i(resources.uniforms.render.pointCount, renderCount);

      const isMobile = width < 720;
      gl.uniform1f(
        resources.uniforms.render.strength,
        isMobile ? rippleConfig.displacementMobile : rippleConfig.displacementDesktop,
      );
      gl.uniform1f(resources.uniforms.render.aberration, rippleConfig.aberration);
      gl.uniform1f(resources.uniforms.render.frequency, rippleConfig.waveFrequency);
      gl.uniform1f(resources.uniforms.render.speed, rippleConfig.waveSpeed);
      gl.uniform1f(resources.uniforms.render.decay, rippleConfig.ageDecay);
      gl.uniform1f(resources.uniforms.render.swirl, rippleConfig.swirl);
      gl.uniform1f(
        resources.uniforms.render.aspect,
        Math.max(0.55, width / Math.max(1, height)),
      );
      gl.uniform1f(resources.uniforms.render.time, timeRef.current);

      bindQuadAndDraw();
    };

    const addRipplePoint = (xNorm, yNorm, motion, pointerType, force = false) => {
      const pointer = pointerRef.current;
      const isMobile = lastRef.current.w < 720;
      const trailSpacing = isMobile
        ? rippleConfig.trailSpacingMobile
        : rippleConfig.trailSpacingDesktop;

      if (pointer.hasEmit && !force) {
        const spacing = Math.hypot(xNorm - pointer.emitX, yNorm - pointer.emitY);
        if (spacing < trailSpacing) return false;
      }

      const motionStrength = clamp(
        0.05,
        motion * rippleConfig.amplitudeScale,
        1.5,
      );
      const radiusBase = isMobile ? rippleConfig.radiusMobile : rippleConfig.radiusDesktop;
      const radius = clamp(
        0.05,
        radiusBase + ((Math.random() - 0.5) * rippleConfig.radiusJitter),
        rippleConfig.radiusMax,
      );
      const deltaLength = Math.hypot(pointer.dx, pointer.dy);
      const velocityX = deltaLength > 0.00001 ? pointer.dx / deltaLength : 0;
      const velocityY = deltaLength > 0.00001 ? pointer.dy / deltaLength : 0;
      const velocityScale =
        rippleConfig.velocityScale * motionStrength * (pointerType === 'touch' ? 1.12 : 1);

      const ripple = {
        x: clamp(0, xNorm, 1),
        y: clamp(0, yNorm, 1),
        vx: velocityX * velocityScale,
        vy: velocityY * velocityScale,
        amplitude: motionStrength,
        radius,
        age: 0,
        life: 2.3 + Math.random() * 0.38,
        phase: Math.random() * Math.PI * 2
      };

      const ripples = rippleRef.current;
      if (ripples.length >= MAX_RIPPLE_POINTS) {
        ripples.shift();
      }
      ripples.push(ripple);

      pointer.emitX = ripple.x;
      pointer.emitY = ripple.y;
      pointer.hasEmit = true;

      activityRef.current = Math.max(activityRef.current, motionStrength * 0.44);
      startLoop();
      return true;
    };

    const stepRipples = (dt) => {
      const clampedDt = clamp(0.001, dt, 0.032);
      const pointer = pointerRef.current;
      const velocityDecay = Math.exp(-rippleConfig.velocityDamping * clampedDt);
      const amplitudeDecay = Math.exp(-rippleConfig.amplitudeDamping * clampedDt);
      const radiusGrow = 1 + (rippleConfig.radiusExpand * clampedDt);

      const ripples = rippleRef.current;
      for (let i = 0; i < ripples.length; i += 1) {
        const ripple = ripples[i];
        ripple.age += clampedDt;
        ripple.x += ripple.vx * clampedDt;
        ripple.y += ripple.vy * clampedDt;
        ripple.vx *= velocityDecay;
        ripple.vy *= velocityDecay;
        ripple.amplitude *= amplitudeDecay;
        ripple.radius = Math.min(rippleConfig.radiusMax, ripple.radius * radiusGrow);
      }

      rippleRef.current = ripples.filter(
        (ripple) =>
          ripple.age < ripple.life &&
          ripple.amplitude > 0.025 &&
          ripple.x > -0.25 &&
          ripple.x < 1.25 &&
          ripple.y > -0.25 &&
          ripple.y < 1.25,
      );

      pointer.dx *= 0.34;
      pointer.dy *= 0.34;
      pointer.impulse *= Math.exp(-rippleConfig.impulseDecay * clampedDt);
      if (!pointer.active) pointer.impulse *= Math.exp(-4.8 * clampedDt);
      if (Math.abs(pointer.dx) < 0.00002) pointer.dx = 0;
      if (Math.abs(pointer.dy) < 0.00002) pointer.dy = 0;
      if (pointer.impulse < 0.0001) pointer.impulse = 0;

      if (pointer.inside && pointer.impulse > 0.02) {
        addRipplePoint(pointer.x, pointer.y, pointer.impulse, pointer.type);
      }

      let strongestRipple = 0;
      rippleRef.current.forEach((ripple) => {
        const energy = ripple.amplitude * Math.exp(-ripple.age * 0.5);
        strongestRipple = Math.max(strongestRipple, energy);
      });
      activityRef.current = Math.max(
        activityRef.current * Math.exp(-5 * clampedDt),
        strongestRipple * 0.55,
      );
      if (pointer.active) {
        activityRef.current = Math.max(activityRef.current, 0.11);
      }
    };

    const configureSizing = (width, height) => {
      const dpr = clamp(1, window.devicePixelRatio || 1, rippleConfig.dprMax);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      lastRef.current.w = width;
      lastRef.current.h = height;
      lastRef.current.dpr = dpr;
      lastRef.current.t = 0;
      timeRef.current = 0;
      activityRef.current = 0;
      rippleRef.current = [];
      pointerRef.current.dx = 0;
      pointerRef.current.dy = 0;
      pointerRef.current.impulse = 0;
      pointerRef.current.hasEmit = false;

      redrawSource();
      renderFrame();
    };

    const resizeToContainer = () => {
      const rect = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(rect.width));
      const height = Math.max(1, Math.round(rect.height));
      const dpr = clamp(1, window.devicePixelRatio || 1, rippleConfig.dprMax);
      const current = lastRef.current;
      if (width === current.w && height === current.h && dpr === current.dpr) return;
      configureSizing(width, height);
    };

    let settledFrames = 0;
    const stopLoop = () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      rafRef.current = 0;
      lastRef.current.t = 0;
      settledFrames = 0;
    };

    const tick = (timestamp) => {
      const dt = lastRef.current.t ? (timestamp - lastRef.current.t) / 1000 : 1 / 60;
      lastRef.current.t = timestamp;
      timeRef.current += clamp(0.001, dt, 0.032);

      stepRipples(dt);
      renderFrame();

      const pointer = pointerRef.current;
      const stillActive =
        pointer.active ||
        pointer.impulse > 0.0004 ||
        rippleRef.current.length > 0 ||
        activityRef.current > rippleConfig.idleThreshold;

      if (!stillActive) {
        settledFrames += 1;
      } else {
        settledFrames = 0;
      }

      if (settledFrames > 16) {
        stopLoop();
        renderFrame();
        return;
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafRef.current) return;
      if (document.visibilityState === 'hidden') return;
      if (!inViewRef.current) return;
      lastRef.current.t = 0;
      settledFrames = 0;
      rafRef.current = window.requestAnimationFrame(tick);
    };

    const pointFromClient = (clientX, clientY) => {
      const rect = canvas.getBoundingClientRect();
      const xRaw = clientX - rect.left;
      const yRaw = clientY - rect.top;
      const inside =
        xRaw >= 0 && xRaw <= rect.width && yRaw >= 0 && yRaw <= rect.height;
      const xNorm = clamp(0, xRaw / Math.max(1, rect.width), 1);
      const yNorm = clamp(0, 1 - yRaw / Math.max(1, rect.height), 1);
      return { inside, xNorm, yNorm };
    };

    const updatePointerFromClient = (clientX, clientY, pointerType = 'mouse') => {
      const point = pointFromClient(clientX, clientY);
      const pointer = pointerRef.current;

      if (!point.inside) {
        pointer.inside = false;
        pointer.hasEmit = false;
        return false;
      }

      const dx = pointer.inside ? point.xNorm - pointer.x : 0;
      const dy = pointer.inside ? point.yNorm - pointer.y : 0;
      const motion = Math.hypot(dx, dy);

      pointer.type = pointerType;
      pointer.x = point.xNorm;
      pointer.y = point.yNorm;
      pointer.inside = true;
      pointer.dx += dx;
      pointer.dy += dy;

      if (motion > 0.000015) {
        const impulse = clamp(
          0.06,
          motion * rippleConfig.motionScale * (pointerType === 'touch' ? 1.24 : 1),
          1.55,
        );
        pointer.impulse = Math.max(pointer.impulse, impulse);
        activityRef.current = Math.max(activityRef.current, impulse * 0.6);
        addRipplePoint(point.xNorm, point.yNorm, impulse, pointerType);
      }

      return true;
    };

    const onVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        stopLoop();
        return;
      }
      startLoop();
    };

    const onMouseDown = (event) => {
      if (event.button !== 0) return;
      const inside = updatePointerFromClient(event.clientX, event.clientY, 'mouse');
      if (!inside) return;
      pointerRef.current.active = true;
      pointerRef.current.impulse = Math.max(pointerRef.current.impulse, rippleConfig.tapBoost);
      addRipplePoint(
        pointerRef.current.x,
        pointerRef.current.y,
        rippleConfig.tapBoost,
        'mouse',
        true,
      );
      startLoop();
    };

    const onMouseUp = () => {
      pointerRef.current.active = false;
    };

    const onMouseMove = (event) => {
      updatePointerFromClient(event.clientX, event.clientY, 'mouse');
    };

    const getTouch = (event) => event.touches?.[0] || event.changedTouches?.[0];

    const onTouchStart = (event) => {
      const touch = getTouch(event);
      if (!touch) return;
      const inside = updatePointerFromClient(touch.clientX, touch.clientY, 'touch');
      if (!inside) return;
      pointerRef.current.active = true;
      const boost = rippleConfig.tapBoost * 1.08;
      pointerRef.current.impulse = Math.max(pointerRef.current.impulse, boost);
      addRipplePoint(pointerRef.current.x, pointerRef.current.y, boost, 'touch', true);
      startLoop();
    };

    const onTouchMove = (event) => {
      const touch = getTouch(event);
      if (!touch) return;
      updatePointerFromClient(touch.clientX, touch.clientY, 'touch');
    };

    const onTouchEnd = () => {
      pointerRef.current.active = false;
      pointerRef.current.inside = false;
      pointerRef.current.hasEmit = false;
    };

    resizeToContainer();

    const ro = new ResizeObserver(() => resizeToContainer());
    ro.observe(canvas);
    resizeObserverRef.current = ro;

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        inViewRef.current = Boolean(entry?.isIntersecting);
        if (inViewRef.current) {
          renderFrame();
          startLoop();
          return;
        }
        stopLoop();
      },
      { threshold: 0.01 },
    );
    io.observe(canvas);
    intersectionObserverRef.current = io;

    window.addEventListener('mousedown', onMouseDown, { passive: true });
    window.addEventListener('mouseup', onMouseUp, { passive: true });
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    document.addEventListener('visibilitychange', onVisibilityChange);
    visibilityHandlerRef.current = onVisibilityChange;

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        redrawSource();
        renderFrame();
      }).catch(() => undefined);
    }

    if (!readyRef.current) {
      readyRef.current = true;
      onReady?.(true);
    }

    return () => {
      stopLoop();
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
      if (intersectionObserverRef.current) intersectionObserverRef.current.disconnect();
      intersectionObserverRef.current = null;
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      if (visibilityHandlerRef.current) {
        document.removeEventListener('visibilitychange', visibilityHandlerRef.current);
        visibilityHandlerRef.current = null;
      }
      if (readyRef.current) {
        readyRef.current = false;
        onReady?.(false);
      }
      sourceRef.current = null;
      rippleRef.current = [];
      timeRef.current = 0;
      lastRef.current = createInitialLastFrameState();
      activityRef.current = 0;
      pointerRef.current = createInitialPointerState();
      destroyResources(gl, resources);
      resources = null;
    };
  }, [
    onReady,
    subtitle,
    theme?.accent,
    theme?.accentAlt,
    theme?.mode,
    theme?.text?.primary,
    theme?.text?.secondary,
    titleHighlight,
    titlePrefix,
    kickerRef,
    subtitleRef
  ]);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
