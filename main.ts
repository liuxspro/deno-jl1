import { Application } from "jsr:@oak/oak/application";
import { Router } from "jsr:@oak/oak/router";
import { webp_to_png } from "jsr:@liuxspro/webp-to-png";
import { create_Capabilities } from "./wmts.ts";
import process from "node:process";

async function convert(data: Uint8Array) {
  const webpHeader = new Uint8Array([0x57, 0x45, 0x42, 0x50]); // "WEBP"
  // Check the next 4 bytes for "WEBP"
  for (let i = 0; i < 4; i++) {
    if (data[8 + i] !== webpHeader[i]) {
      return data;
    } else {
      return await webp_to_png(data);
    }
  }
}

async function get_tile(
  z: string,
  x: string,
  y: string,
  mk: string,
  tk: string
) {
  // 通过添加sch=wmts可返回正常XYZ顺序, 否则使用Math.pow(2, z) - 1 - y计算-y值
  const tile_url = `https://api.jl1mall.com/getMap/${z}/${x}/${y}?mk=${mk}&tk=${tk}&sch=wmts`;
  const tile_data = await (await fetch(tile_url)).bytes();
  // webp to png
  const pngBuffer = convert(tile_data);
  return pngBuffer;
}

async function get_tile_earth(z: string, x: string, y: string) {
  const token = process.env.EARTH_TOKEN || "Bearer fdsa0c81f784490a4c5dfghdfgh";
  const tile_url = `https://tile.charmingglobe.com/tile/china2023_5_shield/wmts/${z}/${x}/${y}?v=v1&token=${token}`;
  const tile_data = await (await fetch(tile_url)).bytes();
  const pngBuffer = convert(tile_data);
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
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body = create_Capabilities(template);
});

router.get("/wmts/jl1", (ctx) => {
  // 获取查询参数
  const url = new URL(ctx.request.url.toString());
  const mk = url.searchParams.get("mk") || "73ad26c4aa6957eef051ecc5a15308b4";
  const tk = url.searchParams.get("tk") || "";
  if (tk == "") {
    ctx.response.body = "tk is needed";
    return;
  }
  const domain = "jl1.deno.dev";
  const template = `https://${domain}/jl1/{TileMatrix}/{TileCol}/{TileRow}?mk=${mk}&amp;tk=${tk}`;
  ctx.response.type = "text/xml;charset=UTF-8";
  ctx.response.body = create_Capabilities(template);
});

const app = new Application();
app.use(router.routes());
app.use(router.allowedMethods());

console.log("Server is runing...");
console.log(`ENV Token is ${process.env.EARTH_TOKEN}`);
app.listen({ port: 80 });
