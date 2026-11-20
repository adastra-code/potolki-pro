import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const urls = [
  "https://avatars.mds.yandex.net/get-altay/7754763/2a000001864a42559bc1c218509deb8eca33/XXXL",
  "https://avatars.mds.yandex.net/get-altay/7979184/2a000001864a4256458f7549523d84bde4f8/XXXL",
  "https://avatars.mds.yandex.net/get-altay/467304/2a000001864a42599cf9c4a3af900255bb65/XXXL",
  "https://avatars.mds.yandex.net/get-altay/5538812/2a000001864a3fdfea3f0e71dd343168ea11/XXXL",
  "https://avatars.mds.yandex.net/get-altay/1773749/2a000001864a42557470ee988047307f41a2/XXXL",
  "https://avatars.mds.yandex.net/get-altay/6409878/2a000001864a4254cd2d91ab0a88076190c4/XXXL",
  "https://avatars.mds.yandex.net/get-altay/1001354/2a000001864a42551eac9345927abf5d309a/XXXL",
  "https://avatars.mds.yandex.net/get-altay/1005628/2a000001864a4255741c26df6c748c935fc2/XXXL",
  "https://avatars.mds.yandex.net/get-altay/5538812/2a00000186473035f70db48cf794b515944e/XXXL",
  "https://avatars.mds.yandex.net/get-altay/1363376/2a0000018647303629cf9853b233b186ba66/XXXL",
  "https://avatars.mds.yandex.net/get-altay/1194602/2a000001864730363ab6ce21e09d40ce5ce1/XXXL",
  "https://avatars.mds.yandex.net/get-altay/1020917/2a000001864730365f1b555e80af8cdf5219/XXXL",
  "https://avatars.mds.yandex.net/get-altay/5255911/2a000001864730362303abf5d7629493c018/XXXL",
  "https://avatars.mds.yandex.net/get-altay/214458/2a00000186473035c8fb5021ba4f60a6963b/XXXL",
  "https://avatars.mds.yandex.net/get-altay/218662/2a0000018647303596bdcddb32aa75a87719/XXXL",
  "https://avatars.mds.yandex.net/get-altay/760153/2a00000186473035b99b542d147543a97d64/XXXL",
  "https://avatars.mds.yandex.net/get-altay/224414/2a00000186264b198a8b01597e07401b26a3/XXXL",
  "https://avatars.mds.yandex.net/get-altay/15457874/2a00000195b7e70840028bae527109edb53d/XXXL",
  "https://avatars.mds.yandex.net/get-altay/15683978/2a0000019aed70508e4f86a84fc2c447e68e/XXXL",
  "https://avatars.mds.yandex.net/get-altay/10845257/2a0000018ac273d63d1f5c8015db083c5784/XXXL",
  "https://avatars.mds.yandex.net/get-altay/9830591/2a00000191e268d7e284732c341620851c11/XXXL",
  "https://avatars.mds.yandex.net/get-altay/10141118/2a0000018ac273d27a0afb3acc2724eb97e6/XXXL",
  "https://avatars.mds.yandex.net/get-altay/9737178/2a0000018bf20119f26e62c21631e5dbefb4/XXXL",
  "https://avatars.mds.yandex.net/get-altay/14112077/2a00000191e268d78dbc558d66e69dd7b153/XXXL",
  "https://avatars.mds.yandex.net/get-altay/15683978/2a0000019aed704e9be9245c72984749c38a/XXXL",
  "https://avatars.mds.yandex.net/get-altay/16899665/2a0000019a6e761f87be988d6447642c38b7/XXXL",
  "https://avatars.mds.yandex.net/get-altay/9827107/2a0000018ac273ca3620b7779ac4f76731ea/XXXL",
  "https://avatars.mds.yandex.net/get-altay/14382555/2a00000196eed141a8ad2d2f2ad1cd5d865b/XXXL",
  "https://avatars.mds.yandex.net/get-altay/15386900/2a00000195b7e708171e6f805bd1ebedb9de/XXXL",
  "https://avatars.mds.yandex.net/get-altay/16136444/2a0000019a6e761f40798062d5e11508946a/XXXL",
  "https://avatars.mds.yandex.net/get-altay/15183726/2a00000195b7e70806ec7c6e339ae4f1deda/XXXL",
  "https://avatars.mds.yandex.net/get-altay/10705374/2a0000018bf20119c42290245288703b12aa/XXXL",
  "https://avatars.mds.yandex.net/get-altay/10142335/2a0000018ac273c68414ce0bcb9ef1eb5738/XXXL",
  "https://avatars.mds.yandex.net/get-altay/13453452/2a0000018f07573d00b4eb2a2a9087adb2d5/XXXL",
  "https://avatars.mds.yandex.net/get-altay/10092863/2a0000018bf20119d678cd58e7a0914d7322/XXXL",
  "https://avatars.mds.yandex.net/get-altay/9728306/2a0000018ac270f33329a2122a21e35d1174/XXXL",
  "https://avatars.mds.yandex.net/get-altay/6249106/2a0000018ac273ce488fd29c7c5264f726a5/XXXL",
  "https://avatars.mds.yandex.net/get-altay/10953738/2a0000018bf2011e8b5b165e9404ba489190/XXXL",
  "https://avatars.mds.yandex.net/get-altay/9719535/2a0000018bf20119a48960b864269083ce99/XXXL",
];

const outDir = join(process.cwd(), "assets", "card");
mkdirSync(outDir, { recursive: true });

let total = 0;
for (let i = 0; i < urls.length; i += 1) {
  const n = String(i + 1).padStart(2, "0");
  const res = await fetch(urls[i]);
  if (!res.ok) {
    console.error(n, res.status);
    continue;
  }
  const buffer = Buffer.from(await res.arrayBuffer());
  total += buffer.length;
  writeFileSync(join(outDir, `${n}.jpg`), buffer);
  console.log(n, (buffer.length / 1024).toFixed(0) + " KB");
}

console.log(`Скачано ${urls.length} фото, ${(total / 1024 / 1024).toFixed(1)} MB`);
