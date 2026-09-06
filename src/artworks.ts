import vendelaLine from "./assets/art/vendela-line.webp";
import vendelaColor from "./assets/art/vendela-color.webp";
import virtuosaLine from "./assets/art/virtuosa-line.webp";
import virtuosaColor from "./assets/art/virtuosa-color.webp";
import fluoriteLine from "./assets/art/fluorite-line.webp";
import fluoriteColor from "./assets/art/fluorite-color.webp";
import rockrockLine from "./assets/art/rockrock-line.webp";
import rockrockColor from "./assets/art/rockrock-color.webp";
import shuLine from "./assets/art/shu-line.webp";
import shuColor from "./assets/art/shu-color.webp";
import duskLine from "./assets/art/dusk-line.webp";
import duskColor from "./assets/art/dusk-color.webp";
import suzuranLine from "./assets/art/suzuran-line.webp";
import suzuranColor from "./assets/art/suzuran-color.webp";
import blemishineLine from "./assets/art/blemishine-line.webp";
import blemishineColor from "./assets/art/blemishine-color.webp";
import angelinaLine from "./assets/art/angelina-line.webp";
import angelinaColor from "./assets/art/angelina-color.webp";

export interface Artwork {
  id: string;
  title: string;
  caption?: string;
  line: string;
  color: string;
}

export const artworks: Artwork[] = [
  { id: "archive-01", title: "vendela", caption: "arknights", line: vendelaLine, color: vendelaColor },
  { id: "archive-02", title: "virtuosa", caption: "arknights", line: virtuosaLine, color: virtuosaColor },
  { id: "archive-03", title: "fluorite", caption: "arknights: endfield", line: fluoriteLine, color: fluoriteColor },
  { id: "archive-04", title: "rockrock", caption: "arknights", line: rockrockLine, color: rockrockColor },
  { id: "archive-05", title: "shu", caption: "arknights", line: shuLine, color: shuColor },
  { id: "archive-06", title: "dusk", caption: "arknights", line: duskLine, color: duskColor },
  { id: "archive-07", title: "suzuran", caption: "arknights", line: suzuranLine, color: suzuranColor },
  { id: "archive-08", title: "blemishine", caption: "arknights", line: blemishineLine, color: blemishineColor },
  { id: "archive-09", title: "angelina", caption: "arknights", line: angelinaLine, color: angelinaColor },
];
