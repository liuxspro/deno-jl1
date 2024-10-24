import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import * as wasm from "./pkg/webp_to_png.js";
import got from "npm:got";
import { create_Capabilities } from "./wmts.ts";

async function get_tile(z: string, x: string, y: string, mk: string, tk: string) {
  // 通过添加sch=wmts可返回正常XYZ顺序, 否则使用Math.pow(2, z) - 1 - y计算-y值
  const tile_url = `https://api.jl1mall.com/getMap/${z}/${x}/${y}?mk=${mk}&tk=${tk}&sch=wmts`;
  const tile_data = await got(tile_url).buffer();
  // webp to png
  const pngBuffer = wasm.webp_to_png(tile_data);
  return pngBuffer;
}

async function get_tile_earth(z: string, x: string, y: string) {
  const token = "Bearer%20a84a40c81f784490a4c5689187054abf";
  const tile_url = `https://tile.charmingglobe.com/tile/china2023_5_shield/wmts/${z}/${x}/${y}?v=v1&token=${token}`;
  const tile_data = await got(tile_url).buffer();
  const pngBuffer = wasm.webp_to_png(tile_data);
  return pngBuffer;
}

const router = new Router();

router.get("/jl1/:z/:x/:y", async (ctx) => {
  const { z, x, y } = ctx.params;

  // 获取查询参数
  const url = new URL(ctx.request.url.toString());
  const mk = url.searchParams.get("mk") || "73ad26c4aa6957eef051ecc5a15308b4";
  const tk = url.searchParams.get("tk") || "";
  const png_data = await get_tile(z, x, y, mk, tk);
  ctx.response.type = "image/png";
  ctx.response.body = png_data;
});

router.get("/jl1earth/:z/:x/:y", async (ctx) => {
  const { z, x, y } = ctx.params;

  const png_data = await get_tile_earth(z, x, y);
  ctx.response.type = "image/png";
  ctx.response.body = png_data;
});

router.get("/", (ctx) => {
  ctx.response.body = "On Deno Deploy 💖";
});

router.get("/wmts/jl1earth", (ctx) => {
  const domain = "jl1.deno.dev";
  const template = `https://${domain}/jl1earth/{TileMatrix}/{TileCol}/{TileRow}`;
  ctx.response.body = create_Capabilities(template);
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server is runing...");
app.listen({ port: 80 });
