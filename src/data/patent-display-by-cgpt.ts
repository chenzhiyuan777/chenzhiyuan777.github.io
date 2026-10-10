// by cgpt: Keep homepage patent corrections isolated from the shared profile data.
// Phase dates below are tied to a certificate, notice, or published specification.
// For Xiaomi records, the user approved using the latest date already available.
// latestStageDateConfirmed and dateNote distinguish that event from a phase date.
import { patents } from "./profile";
import {
  preferredGooglePatentLinksByCgpt,
  verifiedCnkiPatentLinksByCgpt,
} from "./patent-links-by-cgpt";

type SourcePatent = (typeof patents)[number];

export type PatentDisplayRecord = Omit<SourcePatent, "date" | "status"> & {
  date: string;
  status: string;
  statusZh: string;
  sourceDate: string;
  sourceStatus: SourcePatent["status"];
  lastConfirmedDate: string;
  latestStageDateConfirmed: boolean;
  dateNote: string;
};

type VerifiedPatentPhase = Pick<
  PatentDisplayRecord,
  "date" | "status" | "statusZh" | "lastConfirmedDate" | "latestStageDateConfirmed" | "dateNote"
>;

// by cgpt: Evidence paths and the per-patent audit live in the local operation
// record midocx/personalPAGE_操作记录_专利最新日期核查_by_cgpt.md.
const verifiedPhases: Record<string, VerifiedPatentPhase> = {
  "一种机器人系统以及测控方法": {
    date: "2021-03-23",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2021-03-23",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2021-03-23",
  },
  "物品存取及测量装置": {
    date: "2021-07-09",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2021-07-09",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2021-07-09",
  },
  "机器人及其控制方法和控制装置、标定方法和标定控制装置、存储介质": {
    date: "2023-04-07",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2023-04-07",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2023-04-07",
  },
  "用于FPC装配的目标引导式机器人系统及其控制方法、装置": {
    date: "2024-03-12",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2024-03-12",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2024-03-12",
  },
  "机器人系统及其测控方法和面激光接受器": {
    date: "2023-07-14",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2023-07-14",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2023-07-14",
  },
  "手机钢压片自动装配系统、控制方法及存储介质": {
    date: "2026-05-26",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2026-05-26",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2026-05-26",
  },
  "一种可伸缩花盆": {
    date: "2017-11-24",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2017-11-24",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2017-11-24",
  },
  "花盆鱼缸结合装置": {
    date: "2018-05-01",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2018-05-01",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2018-05-01",
  },
  "机器人的控制方法、装置、设备、芯片和介质": {
    date: "",
    status: "Initial examination passed",
    statusZh: "初步审查合格",
    lastConfirmedDate: "2026-08-12",
    latestStageDateConfirmed: false,
    dateNote: "初步审查合格日期待核实；系统截图只载明申请日 2026-08-12",
  },
  "一种机器人的控制方法、装置、机器人系统及存储介质": {
    date: "",
    status: "Initial examination passed",
    statusZh: "初步审查合格",
    lastConfirmedDate: "2026-05-28",
    latestStageDateConfirmed: false,
    dateNote: "初步审查合格日期待核实；系统截图只载明申请日 2026-05-28",
  },
  "一种数据采集方法及装置、系统、电子设备及介质": {
    date: "",
    status: "Initial examination passed",
    statusZh: "初步审查合格",
    lastConfirmedDate: "2026-05-28",
    latestStageDateConfirmed: false,
    dateNote: "初步审查合格日期待核实；系统截图只载明申请日 2026-05-28",
  },
  "机械手的控制方法、装置、机械手、机器人、介质及产品": {
    date: "2026-09-18",
    status: "Granted",
    statusZh: "已授权",
    lastConfirmedDate: "2026-09-18",
    latestStageDateConfirmed: true,
    dateNote: "授权公告日：2026-09-18",
  },
  "机械手控制方法、装置、机械手、机械臂、机器人和芯片": {
    date: "2026-08-07",
    status: "Published",
    statusZh: "已公开",
    lastConfirmedDate: "2026-08-07",
    latestStageDateConfirmed: true,
    dateNote: "申请公布日：2026-08-07",
  },
  "机器人控制方法及装置、电子设备及存储介质": {
    date: "",
    status: "Published",
    statusZh: "已公开",
    lastConfirmedDate: "2026-06-09",
    latestStageDateConfirmed: false,
    dateNote: "进入实质审查阶段日期待核实；已确认申请公布日为 2026-06-09",
  },
};

// by cgpt: Per the user's approval, Xiaomi records without a phase-update date
// display their last documented event date. All visible dates sort newest first.
export const patentDisplayRecords: PatentDisplayRecord[] = patents
  .map((patent) => {
    const verified = verifiedPhases[patent.titleZh];
    if (!verified) {
      throw new Error(`Patent phase evidence is missing: ${patent.titleZh}`);
    }
    // by cgpt: Resolve an exact, verified public record rather than a broad kw URL.
    const cnkiRecord = verifiedCnkiPatentLinksByCgpt[patent.titleZh];
    if (
      cnkiRecord &&
      patent.number !== cnkiRecord.publicationOrGrantNumber &&
      !patent.number?.endsWith(cnkiRecord.applicationNumber)
    ) {
      throw new Error(`CNKI patent identity does not match: ${patent.titleZh}`);
    }
    return {
      ...patent,
      // by cgpt: Preserve the user's Google Patents preference for both utility models.
      href: preferredGooglePatentLinksByCgpt[patent.titleZh] ?? cnkiRecord?.href,
      cnkiPublicNumber: cnkiRecord?.publicationOrGrantNumber,
      sourceDate: patent.date,
      sourceStatus: patent.status,
      ...verified,
      date: verified.date || verified.lastConfirmedDate,
    };
  })
  .sort((a, b) => b.date.localeCompare(a.date));
