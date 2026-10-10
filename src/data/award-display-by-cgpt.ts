// by cgpt: Derive award display data separately so concurrent profile edits remain intact.
import { competitionAwards, selectedHonors, type Award } from "./profile";

export type AwardDisplayRecord = Award & {
  recipientsEn: string;
  recipientsHtml: string;
};

const recipientOverrides: Record<string, string> = {
  "清华大学博士生实践金奖支队（BG支队，队长）": "Zhiyuan Chen (team lead), BG team",
};

const escapeHtml = (text: string) =>
  text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

const toDisplayRecord = (award: Award): AwardDisplayRecord => {
  // by cgpt: Keep the existing English spelling of each recipient and omit the Chinese duplicate.
  const recipientsEn = recipientOverrides[award.titleZh] ?? award.recipients.split(/\s*\/\s*/u)[0].trim();
  return {
    ...award,
    recipients: recipientsEn,
    recipientsEn,
    recipientsHtml: escapeHtml(recipientsEn).replaceAll("Zhiyuan Chen", "<strong>Zhiyuan Chen</strong>"),
  };
};

const latestAwardDate = (date?: string) => {
  const dates = date?.match(/\d{4}(?:-\d{2})?(?:-\d{2})?/gu) ?? [];
  const normalized = dates.map((value) => {
    const [year, month = "00", day = "00"] = value.split("-");
    return `${year}-${month}-${day}`;
  });
  return normalized.sort().at(-1) ?? "0000-00-00";
};

const sortByLatestDate = (a: Award, b: Award) =>
  latestAwardDate(b.date).localeCompare(latestAwardDate(a.date));

const forumCompetitionRecords: Award[] = [
  ...selectedHonors
    .filter((award) => award.titleZh.includes("第777期"))
    .map((award) => ({ ...award })),
  {
    // by cgpt: Show the outstanding oral presentation without the prize ranking.
    titleEn:
      "First Tsinghua–Peking–Beihang Graduate Forum on Mechanical Engineering (Tsinghua University 627th PhD Academic Forum), Outstanding Oral Presentation",
    titleZh:
      "首届清华-北大-北航三校机械工程研究生学术论坛暨清华大学第627期（机械系）博士生学术论坛优秀口头报告",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2021-05-16",
    awardingOrganization: "Tsinghua University",
  },
];

export const competitionDisplayRecords: AwardDisplayRecord[] = [...competitionAwards, ...forumCompetitionRecords]
  .sort(sortByLatestDate)
  .map(toDisplayRecord);

// by cgpt: The supplied Three-Star Volunteer certificate is dated May 2024.
export const honorDisplayRecords: AwardDisplayRecord[] = selectedHonors
  .filter((award) => !award.titleZh.includes("第777期"))
  .map((award) => award.titleZh === "清华大学三星级志愿者"
    ? { ...award, date: "2024-05" }
    : { ...award })
  .sort(sortByLatestDate)
  .map(toDisplayRecord);
