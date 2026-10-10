// by cgpt: Resource entries link directly to videos/playlists or show availability.
export type PublicationLink = {
  label: "Project" | "Paper" | "Video" | "Code" | "Report";
} & ({ href: string; note?: never } | { href?: never; note: string });

export type Publication = {
  id?: string;
  title: string;
  authors: string;
  authorsHtml?: string;
  // by cgpt: Preserve a longer public-version author list when a merged card shows a shorter submission list.
  fullReportAuthors?: string;
  correspondingAuthorNote?: string;
  venue: string;
  year: string;
  // by cgpt: Identify a public report alongside a conference submission of the same work.
  versionNote?: string;
  // by cgpt: Display the author's requested venue classifications.
  venueBadge?: "Top Conference" | "Top Journal" | "Q1" | "Q3";
  image?: string;
  // by cgpt: A pixel-exact first-frame cover defers the larger lossless animation.
  imagePoster?: string;
  imageAlt?: string;
  mediaAspect?: "wide";
  // by cgpt: Use false when an overlaid label would obscure a scientific figure.
  mediaLabel?: string | false;
  // by cgpt: Reserve label space above dense figures or align to the upper edge.
  mediaLabelPosition?: "top-edge" | "above";
  summary?: string;
  links?: PublicationLink[];
  placeholder?: boolean;
};

type NewsItem = {
  date: string;
  text: string;
  textHtml?: string;
  icon?: "trophy";
  href?: string;
  jumpHref?: string;
  jumpLabel?: string;
};

export const news: NewsItem[] = [
  {
    date: "2026",
    // by cgpt: Spell out the real robot track while retaining its official number.
    text: "ViTacX, led by Zhiyuan Chen, won 1st place in the Real Robot Track (Track 3) of the IROS 2026 · WorldArena 2.0 Challenge.",
    textHtml:
      "<strong>ViTacX</strong>, led by Zhiyuan Chen, won <strong>1st place</strong> in the <strong>Real Robot Track</strong> (Track 3) of the <strong>IROS 2026</strong> · <strong>WorldArena 2.0</strong> Challenge.",
    icon: "trophy",
    href: "https://huggingface.co/spaces/WorldArena/WorldArena2.0",
    jumpHref: "#competition-worldarena-2026",
    jumpLabel: "View the ViTacX competition result",
  },
  {
    date: "2026",
    text: "PACE has been accepted for an oral presentation at CoRL 2026.",
    textHtml: "PACE has been accepted for an <strong>oral</strong> presentation at CoRL 2026.",
    href: "https://pace-insertion.github.io/",
    jumpHref: "#publication-pace",
    jumpLabel: "View the PACE publication",
  },
  {
    date: "2025",
    text: "Joined Xiaomi after completing my doctoral studies.",
  },
  {
    date: "2025",
    text: "Received my Ph.D. in Mechanical Engineering from Tsinghua University.",
  },
];

export const publications: Publication[] = [
  // by cgpt: Featured order: PACE, ForeTac, Finder, UCAG-P, ALTER, TIM, AEI, JCEM, NAMRC, CIN.
  // by cgpt: Summaries follow the published sources; the early CT paper is omitted.
  {
    id: "publication-pace",
    title: "PACE: Temporal-Role Tactile Conditioning for Chunk-Based Insertion Policies",
    authors: "Zhiyuan Chen, Shixiong Xu, Shuai Chen, Yangwei You",
    authorsHtml:
      "<strong>Zhiyuan Chen</strong><sup>*</sup>, Shixiong Xu, Shuai Chen, Yangwei You",
    correspondingAuthorNote: "* Corresponding Author",
    venue: "CoRL 2026 (Oral)",
    year: "2026",
    venueBadge: "Top Conference",
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/pace/pace_overview_4x_refine_clear-lossless-by-cgpt.webp",
    imagePoster: "/videos/pace/pace_overview_4x_refine_clear-poster-lossless-by-cgpt.webp",
    imageAlt: "PACE temporal roles and representative insertion tasks animation",
    mediaAspect: "wide",
    mediaLabel: "CoRL 2026 (Oral)",
    summary:
      "A temporal-role tactile conditioning framework that separates persistent contact states, abrupt contact events, and future contact consequences for contact-rich insertion.",
    links: [
      {
        label: "Project",
        href: "https://pace-insertion.github.io/",
      },
      {
        label: "Paper",
        note: "Coming soon",
      },
    ],
  },
  {
    // by cgpt: RAL submission; show the known first author and keep pending co-authors explicit.
    title: "ForeTac: Predictive Contact Guidance for Generative Robot Policies",
    authors: "Zhiyuan Chen, co-authors pending",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, co-authors pending",
    venue: "IEEE Robotics and Automation Letters (Under Review)",
    year: "2026",
    // by cgpt: Preserve the requested source slices: 0–3 s followed by 12–25 s.
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/foretac/foretac-overview-3s-plus-12-25s-lossless-by-cgpt.webp",
    imagePoster: "/videos/foretac/foretac-overview-3s-plus-12-25s-poster-lossless-by-cgpt.webp",
    imageAlt:
      "ForeTac overview: human contact anticipation and predictive robot contact guidance from tactile foresight",
    mediaAspect: "wide",
    mediaLabel: "RAL 2026 (Under Review)",
    summary:
      "ForeTac predicts tactile consequences of candidate actions and propagates contact-quality guidance through the predictor to steer generative policies toward stable contact.",
    links: [
      // by cgpt: Project URL extracted from the ForeTac manuscript PDF.
      { label: "Project", href: "https://foretac.github.io/" },
      { label: "Paper", note: "Not public" },
    ],
  },
  {
    // by cgpt: Author order follows arXiv; ICRA 2026 submission status is user-provided.
    title: "Finder: Agentic Closed-Loop Object Finding for Embodied Grounding",
    authors:
      "Shixiong Xu, Zhiyuan Chen, Song Ding, Rui Luo, Xiaowei Liang, Dongxu Miao, Zhiying Du",
    authorsHtml:
      "Shixiong Xu, <strong>Zhiyuan Chen</strong>, Song Ding, Rui Luo, Xiaowei Liang, Dongxu Miao, Zhiying Du",
    venue: "ICRA 2026 (Under Review)",
    year: "2026",
    image: "/images/publications/finder-overview-by-cgpt.png",
    imageAlt:
      "Finder overview: contextual RGB-D observations feed a planning, detection, verification, and judgment loop for object grounding",
    mediaAspect: "wide",
    mediaLabel: "ICRA 2026 (Under Review)",
    summary:
      "An agentic perception loop plans evidence gathering and verifies object candidates to ground language queries in 3D scenes.",
    links: [
      { label: "Project", href: "https://finder-vln.github.io/" },
      { label: "Paper", href: "https://arxiv.org/abs/2609.18058" },
    ],
  },
  {
    // by cgpt: Merge the AAAI submission and Xiaomi report as one UCAG-P work.
    // by cgpt: Show the shorter AAAI author list; preserve the 21-author report citation below.
    title:
      "One Policy, Many Embodiments: Unified Camera-Centric Action Geometry Pre-training for Heterogeneous Embodied Manipulation",
    authors:
      "Shaoqing Xu, Fang Li, Guozhi Zhan, Zhixiang Duan, Yuhan Wang, Longlong Wang, Longmei Jiang, Zhiyuan Chen, Yangwei You, Zhiying Du, Zhi-xin Yang",
    authorsHtml:
      "Shaoqing Xu, Fang Li, Guozhi Zhan, Zhixiang Duan, Yuhan Wang, Longlong Wang, Longmei Jiang, <strong>Zhiyuan Chen</strong>, Yangwei You, Zhiying Du, Zhi-xin Yang",
    fullReportAuthors:
      "Shaoqing Xu, Fang Li, Guozhi Zhan, Zhixiang Duan, Yuhan Wang, Yuechen Luo, Shengyin Jiang, Hanbing Li, Zhiying Du, Longlong Wang, Longmei Jiang, Weixiang Liang, Ying Gong, Yong Pan, Ziping Zhao, Zhiyuan Chen, Yangwei You, Kun Ma, Qinyuan Liu, Hangjun Ye, Zhi-xin Yang",
    venue: "AAAI 2027 (Under Review)",
    year: "2026",
    versionNote: "2026 · Xiaomi Technical Report (public version)",
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/ucag-p/ucag-p-human-to-robot-2x-lossless-by-cgpt.webp",
    imagePoster: "/videos/ucag-p/ucag-p-human-to-robot-2x-poster-lossless-by-cgpt.webp",
    imageAlt:
      "UCAG-P human-to-robot transfer: a human demonstrates bread pickup, followed by the robot performing the task",
    mediaAspect: "wide",
    mediaLabel: "Xiaomi Technical Report 2026",
    summary:
      "A camera-centric action representation unifies robot and human demonstrations to train a shared manipulation policy across heterogeneous embodiments.",
    links: [
      { label: "Project", href: "https://public-bots.github.io/UCAG-P/" },
      { label: "Paper", note: "Not public" },
      { label: "Report", href: "https://arxiv.org/abs/2608.26058" },
    ],
  },
  {
    // by cgpt: MobiCom 2027 submission; keep the author line anonymous until review.
    title: "ALTER: Keeping Vision-Language-Action Control in Step with Real-World Dynamics",
    authors: "Co-author",
    authorsHtml: "Co-author",
    venue: "MobiCom 2027 (Under Review)",
    year: "2026",
    // by cgpt: Official real-robot obstacle clips, aligned at board insertion with the full view preserved.
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/alter/alter-obstacle-board-comparison-lossless-by-cgpt.webp",
    imagePoster: "/videos/alter/alter-obstacle-board-comparison-poster-lossless-by-cgpt.webp",
    imageAlt:
      "Real-robot obstacle comparison: pi0.5 tips the bowl after a board is introduced, while ALTER lifts the block over the board and places it in the bowl",
    mediaAspect: "wide",
    mediaLabel: "MobiCom 2027 (Under Review)",
    summary:
      "ALTER couples periodic server-side action-chunk generation with lightweight on-device refinement, keeping VLA control responsive to fresh observations while reducing server invocations.",
    links: [
      // by cgpt: Project URL from page 1 of 个人主页/alter/mobicom27-paper415.pdf.
      { label: "Project", href: "https://alter-vla.github.io/ALTER-vla/" },
      { label: "Paper", note: "Not public" },
    ],
  },
  {
    title:
      "Image-Based Visual Servoing With Collision-Free Path Planning for Monocular Vision-Guided Assembly",
    authors: "Zhiyuan Chen, Tiemin Li, Yao Jiang",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Tiemin Li, Yao Jiang",
    venue: "IEEE Transactions on Instrumentation and Measurement",
    year: "2024",
    venueBadge: "Top Journal",
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/tim-ibvs/ibvs_overview_view2_2x_clean_clear-lossless-by-cgpt.webp",
    imagePoster: "/videos/tim-ibvs/ibvs_overview_view2_2x_clean_clear-poster-lossless-by-cgpt.webp",
    imageAlt: "Monocular visual servoing: orientation alignment followed by docking",
    mediaAspect: "wide",
    mediaLabel: "IEEE TIM 2025",
    summary:
      "A monocular visual servoing method plans collision-free assembly motions by aligning part orientation before following a straight docking path.",
    links: [
      // by cgpt: Use the author's public YouTube video.
      { label: "Video", href: "https://youtu.be/ra73hUFRvVA" },
      { label: "Paper", href: "https://doi.org/10.1109/TIM.2024.3463014" },
    ],
  },
  {
    title:
      "Object-based Terminal Positioning Solution within Task-boosted Global Constraint for Improving Mobile Robotic Stacking Accuracy",
    authors: "Zhiyuan Chen, Yixiao Feng, Tiemin Li, Yao Jiang",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Yixiao Feng, Tiemin Li, Yao Jiang",
    venue: "Advanced Engineering Informatics",
    year: "2024",
    venueBadge: "Top Journal",
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/aei/aei_overview_preview_clear-lossless-by-cgpt.webp",
    imagePoster: "/videos/aei/aei_overview_preview_clear-poster-lossless-by-cgpt.webp",
    imageAlt: "Mobile robot stacking blocks with a visual reference system",
    mediaAspect: "wide",
    mediaLabel: "AEI 2024",
    summary:
      "An object-referenced positioning system combines multi-sensor feedback with a global laser constraint to improve accuracy during continuous mobile robotic stacking.",
    links: [
      // by cgpt: Use the author's public YouTube video.
      { label: "Video", href: "https://youtu.be/p7b6gFioKiw" },
      { label: "Paper", href: "https://doi.org/10.1016/j.aei.2024.102521" },
    ],
  },
  {
    title:
      "Vision-Guided Autonomous Block Loading in a Dual-Robot Collaborative Handling Framework",
    authors: "Zhiyuan Chen, Tiemin Li, Lichang Qin, Yao Jiang",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Tiemin Li, Lichang Qin, Yao Jiang",
    venue: "Journal of Construction Engineering and Management",
    year: "2025",
    venueBadge: "Q1",
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/jcem-handling/jcem_overview_preview_lite_clear-lossless-by-cgpt.webp",
    imagePoster: "/videos/jcem-handling/jcem_overview_preview_lite_clear-poster-lossless-by-cgpt.webp",
    imageAlt: "A robot arm places a block onto a collaborating mobile platform",
    mediaAspect: "wide",
    mediaLabel: "JCEM 2025",
    summary:
      "A dual-robot loading system combines visual grasp localization, in-hand pose correction, and placement feedback to handle blocks autonomously.",
    links: [
      // by cgpt: Open the author's complete JCEM playlist directly.
      { label: "Video", href: "https://www.youtube.com/playlist?list=PLqivtkEwyyFxh2R196XnPTy-E88YUTqqd" },
      { label: "Paper", href: "https://doi.org/10.1061/JCEMD4.COENG-15847" },
    ],
  },
  {
    title:
      "Precise Geometry and Pose Measurement of In-hand Objects with Simple Features Using a Multi-camera System",
    authors: "Zhiyuan Chen, Tiemin Li",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Tiemin Li",
    venue: "Manufacturing Letters",
    year: "2023",
    venueBadge: "Q3",
    // by cgpt: Pixel-exact lossless animation and full-resolution first-frame cover.
    image: "/videos/namrc/namrc_overview_preview_clear-lossless-by-cgpt.webp",
    imagePoster: "/videos/namrc/namrc_overview_preview_clear-poster-lossless-by-cgpt.webp",
    imageAlt: "A multi-camera system measures an object held by a robot arm",
    mediaAspect: "wide",
    mediaLabel: "NAMRC 2023",
    summary:
      "A multi-camera system reconstructs the geometry and pose of grasped objects to compensate for grasp errors and support precise robotic placement.",
    links: [
      // by cgpt: One direct playlist link replaces the two-video chooser.
      { label: "Video", href: "https://www.youtube.com/playlist?list=PLqivtkEwyyFwjfqBnQvhCg7r-ZksauOlh" },
      { label: "Paper", href: "https://doi.org/10.1016/j.mfglet.2023.07.020" },
    ],
  },
  {
    // by cgpt: Published title, complete author order, and static Figure 12(a)(b).
    title:
      "A Cross-Reference Line Method Based Multiobjective Evolutionary Algorithm to Enhance Population Diversity",
    authors: "Ya-Nan Feng, Zhao-Hui Wang, Jia-Rong Fan, Ting Fu, Zhi-Yuan Chen",
    authorsHtml:
      "Ya-Nan Feng, Zhao-Hui Wang, Jia-Rong Fan, Ting Fu, <strong>Zhi-Yuan Chen</strong>",
    venue: "Computational Intelligence and Neuroscience",
    year: "2020",
    image: "/images/publications/cin-figure12-ab-by-cgpt.png",
    imageAlt:
      "Figure 12(a)(b): contributing solutions and the updated archive in adaptive cross-reference-line optimization",
    mediaAspect: "wide",
    mediaLabel: "Comput. Intell. Neurosci. 2020",
    summary:
      "An evolutionary algorithm combines adaptive reference lines from ideal and nadir points to balance convergence and population diversity in multiobjective optimization.",
    links: [
      { label: "Paper", href: "https://doi.org/10.1155/2020/7179647" },
    ],
  },
];

export const experiences = [
  {
    period: "2025-Present",
    organization: "Xiaomi",
    role: "Robotics Researcher",
    description:
      "Developing fine-grained vision-tactile perception and precision manipulation algorithms, leveraging human data for learning robust robot behaviors.",
    placeholder: false,
  },
  {
    period: "2022-2025",
    organization: "Tsinghua University",
    role: "Ph.D. in Mechanical Engineering",
    description:
      "Research on robot perception and closed-loop manipulation, with an emphasis on vision-guided precision assembly, image-based visual servoing, collision-aware motion planning, and real-world robotic system integration.",
    descriptionHtml:
      "Research on <strong>robot perception and closed-loop manipulation</strong>, with an emphasis on vision-guided precision assembly, image-based visual servoing, collision-aware motion planning, and real-world robotic system integration.",
  },
  {
    period: "2023",
    organization: "Huawei",
    role: "Robotics Research Intern",
    description:
      "Developed monocular vision, pose estimation, and closed-loop control algorithms for flexible printed circuit assembly, achieving sub-0.4 mm alignment error in the reported project evaluation.",
  },
  {
    period: "2019-2022",
    organization: "Tsinghua University",
    role: "M.S. in Mechanical Engineering",
    description:
      "Ranked 1/46. Research on vision-based robotic perception and autonomous manipulation, including object localization, pose measurement, multi-sensor feedback, and robotic system development.",
    descriptionHtml:
      "Ranked 1/46. Research on <strong>vision-based robotic perception and autonomous manipulation</strong>, including object localization, pose measurement, multi-sensor feedback, and robotic system development.",
  },
  {
    period: "2015-2019",
    organization: "Wuhan University of Science and Technology",
    role: "B.Eng. in Mechatronic Engineering",
    description:
      "Rank 1/440.",
  },
];

export const researchProjects = [
  {
    type: "Research",
    organization: "Xiaomi Robotics",
    title: "Reliable robot learning and physical interaction",
    description:
      "Current research on tactile-conditioned insertion policies, contact-aware manipulation, and robust robot learning.",
    logo: "/images/xiaomi.png",
  },
];

export const education = experiences.filter((experience) =>
  ["Tsinghua University", "Wuhan University of Science and Technology"].includes(
    experience.organization,
  ),
);

export const workExperience = experiences.filter(
  (experience) => !education.includes(experience),
);

// Keep source dates at day precision for sorting and evidence; the page renders years only.
type Patent = {
  titleEn: string;
  titleZh: string;
  hideChineseTitle?: boolean;
  authors: string;
  authorsHtml?: string;
  cnkiPublicNumber?: string;
  number?: string;
  date: string;
  status:
    | "Granted"
    | "Published"
    | "Initial examination passed"
    | "Substantive examination"
    | "Status not provided";
  awardingOrganization: string;
  href?: string;
};

const patentRecords: Patent[] = [
  {
    titleEn: "Robot System and Measurement and Control Method",
    titleZh: "一种机器人系统以及测控方法",
    authors: "Yao Jiang, Zhiyuan Chen, Fengchun Li, Tiemin Li",
    authorsHtml: "Yao Jiang, <strong>Zhiyuan Chen</strong>, Fengchun Li, Tiemin Li",
    cnkiPublicNumber: "CN112123342B",
    number: "ZL202011333511.7",
    date: "2021-03-23",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Object Storage, Retrieval, and Measurement Device",
    titleZh: "物品存取及测量装置",
    authors: "Yao Jiang, Zhiyuan Chen, Fengchun Li, Tiemin Li",
    authorsHtml: "Yao Jiang, <strong>Zhiyuan Chen</strong>, Fengchun Li, Tiemin Li",
    cnkiPublicNumber: "CN111872944B",
    number: "ZL202010454402.4",
    date: "2021-07-09",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Robot, Control and Calibration Methods and Devices, and Storage Medium",
    titleZh: "机器人及其控制方法和控制装置、标定方法和标定控制装置、存储介质",
    authors: "Yao Jiang, Zhiyuan Chen, Tiemin Li",
    authorsHtml: "Yao Jiang, <strong>Zhiyuan Chen</strong>, Tiemin Li",
    cnkiPublicNumber: "CN114055444B",
    number: "ZL202111290387.5",
    date: "2023-04-07",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Target-Guided Robot System for FPC Assembly and Its Control Method and Device",
    titleZh: "用于FPC装配的目标引导式机器人系统及其控制方法、装置",
    authors: "Yao Jiang, Zhiyuan Chen, Tiemin Li, Siyuan Feng",
    authorsHtml: "Yao Jiang, <strong>Zhiyuan Chen</strong>, Tiemin Li, Siyuan Feng",
    cnkiPublicNumber: "CN117283570B",
    number: "ZL202311549760.3",
    date: "2024-03-12",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Robot System, Measurement and Control Method, and Planar Laser Receiver",
    titleZh: "机器人系统及其测控方法和面激光接受器",
    authors: "Yao Jiang, Xiangyu Tian, Zhiyuan Chen, Tiemin Li",
    authorsHtml: "Yao Jiang, Xiangyu Tian, <strong>Zhiyuan Chen</strong>, Tiemin Li",
    cnkiPublicNumber: "CN114102622B",
    number: "ZL202111388884.9",
    date: "2023-07-14",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Automatic Assembly System for Smartphone Steel Retaining Plates, Control Method, and Storage Medium",
    titleZh: "手机钢压片自动装配系统、控制方法及存储介质",
    authors: "Siyuan Feng, Zhiyuan Chen",
    authorsHtml: "Siyuan Feng, <strong>Zhiyuan Chen</strong>",
    cnkiPublicNumber: "CN117620965A",
    number: "ZL202311447393.6",
    date: "2026-05-26",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Telescopic Flowerpot",
    titleZh: "一种可伸缩花盆",
    hideChineseTitle: true,
    authors: "Zhiyuan Chen, Yuxi Zhou",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Yuxi Zhou",
    number: "ZL201720301930.X",
    date: "2017-11-24",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Combined Flowerpot and Fish Tank Device",
    titleZh: "花盆鱼缸结合装置",
    hideChineseTitle: true,
    authors: "Kai Le, Haixin Chen, Zhiyuan Chen",
    authorsHtml: "Kai Le, Haixin Chen, <strong>Zhiyuan Chen</strong>",
    number: "ZL201721270890.3",
    date: "2018-05-01",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Robot Control Method, Apparatus, Device, Chip, and Medium",
    titleZh: "机器人的控制方法、装置、设备、芯片和介质",
    authors: "Zhiyuan Chen, Shuai Chen",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Shuai Chen",
    date: "2026-08-12",
    status: "Initial examination passed",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Robot Control Method, Apparatus, Robot System, and Storage Medium",
    titleZh: "一种机器人的控制方法、装置、机器人系统及存储介质",
    authors: "Zhiyuan Chen, Yangwei You, Shuai Chen",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Yangwei You, Shuai Chen",
    date: "2026-05-28",
    status: "Initial examination passed",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Data Collection Method and Apparatus, System, Electronic Device, and Medium",
    titleZh: "一种数据采集方法及装置、系统、电子设备及介质",
    authors: "Zhiyuan Chen, Yangwei You, Tianlin Liu",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Yangwei You, Tianlin Liu",
    date: "2026-05-28",
    status: "Initial examination passed",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Manipulator Control Method, Apparatus, Manipulator, Robot, Medium, and Product",
    titleZh: "机械手的控制方法、装置、机械手、机器人、介质及产品",
    authors: "Zhiyuan Chen, Dongxiao Yang, Ran Cao, Yangwei You",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Dongxiao Yang, Ran Cao, Yangwei You",
    number: "CN122165449A", // by cgpt: application publication number from the local patent record.
    date: "2026-09-18",
    status: "Granted",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Manipulator Control Method, Apparatus, Manipulator, Robotic Arm, Robot, and Chip",
    titleZh: "机械手控制方法、装置、机械手、机械臂、机器人和芯片",
    authors: "Dongxiao Yang, Zhiyuan Chen",
    authorsHtml: "Dongxiao Yang, <strong>Zhiyuan Chen</strong>",
    number: "CN122518342A", // by cgpt: application publication number from the local patent record.
    date: "2026-05-08",
    status: "Published",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
  {
    titleEn: "Robot Control Method and Apparatus, Electronic Device, and Storage Medium",
    titleZh: "机器人控制方法及装置、电子设备及存储介质",
    authors: "Zhiyuan Chen, Ran Cao, Yangwei You, Kun Zhang",
    authorsHtml: "<strong>Zhiyuan Chen</strong>, Ran Cao, Yangwei You, Kun Zhang",
    number: "CN122165415A", // by cgpt: application publication number from the local patent record.
    date: "2026-04-09",
    status: "Status not provided",
    awardingOrganization: "National Intellectual Property Administration of China",
  },
];

// Keep these as the legacy public result-page searches. The title, inventor, and
// organization terms narrow the ordinary query without pretending to be fielded AND
// parameters, which CNKI stores in the browser session instead.
for (const patent of patentRecords) {
  if (patent.cnkiPublicNumber) {
    const terms = `${patent.titleZh} 陈志远 清华大学`;
    patent.href = `https://kns.cnki.net/kns8s/defaultresult/index?dbcode=SCPD&korder=SU&kw=${encodeURIComponent(terms)}`;
  }
}

// The two early utility models have stable Google Patents pages in English.
patentRecords.find((patent) => patent.titleEn === "Telescopic Flowerpot")!.href =
  "https://patents.google.com/patent/CN206658610U/en";
patentRecords.find((patent) => patent.titleEn === "Combined Flowerpot and Fish Tank Device")!.href =
  "https://patents.google.com/patent/CN207284804U/en";

// The site numbers patents in this date order, newest first.
export const patents = [...patentRecords].sort((a, b) => b.date.localeCompare(a.date));

export type Award = {
  id?: string;
  titleEn: string;
  titleZh: string;
  recipients: string;
  date?: string;
  awardingOrganization: string;
  href?: string;
};

const competitionAwardRecords: Award[] = [
  {
    titleEn: "Tsinghua Building Robot Technology Innovation Competition, Bronze Award",
    titleZh: "清华大学建筑机器人技术创新赛铜奖",
    recipients: "Zhiyuan Chen, Lichang Qin / 陈志远、秦立昌",
    date: "2023-11",
    awardingOrganization: "Tsinghua University",
  },
  {
    id: "competition-worldarena-2026",
    // by cgpt: Make the real robot competition and first-place result explicit.
    titleEn: "IROS 2026 WorldArena 2.0 Challenge — First Place, Real Robot Track (Track 3)",
    titleZh: "IROS 2026 WorldArena 2.0 挑战赛真机赛道（Track 3）冠军",
    recipients: "Zhiyuan Chen, Kaiyuan Yang, Diyun Xiang, Yangwei You",
    date: "2026",
    awardingOrganization: "IROS 2026 Workshop Organizers",
  },
  {
    titleEn: "National College Student Mechanical Innovation Design Competition, Hubei First Prize",
    titleZh: "全国大学生机械创新设计大赛湖北赛区一等奖",
    recipients: "Zhiyuan Chen (team lead), Gangping Chen, Wei Zheng, Bangxin Wang, Xiaopeng Li / 陈志远（队长）、陈港平、郑伟、王邦昕、李小鹏",
    date: "2018-05",
    awardingOrganization: "Wuhan University of Science and Technology",
  },
  {
    titleEn: "Mathematical Contest in Modeling, Meritorious Winner",
    titleZh: "美国大学生数学建模竞赛国际一等奖",
    recipients: "Zhiyuan Chen (team lead), Yao Wang, Chao Rao / 陈志远（队长）、王尧、饶超",
    date: "2018",
    awardingOrganization: "COMAP",
  },
  {
    titleEn: "China Undergraduate Mathematical Contest in Modeling, Hubei First Prize",
    titleZh: "全国大学生数学建模竞赛湖北赛区一等奖",
    recipients: "Zhiyuan Chen (team lead), Chao Rao, Yue Dong / 陈志远（队长）、饶超、董悦",
    date: "2017-09",
    awardingOrganization: "Chinese Society for Industrial and Applied Mathematics",
  },
  {
    titleEn: "National College Student Mathematics Competition, Hubei Second Prize",
    titleZh: "全国大学生数学竞赛湖北赛区二等奖",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2017-11",
    awardingOrganization: "Chinese Mathematical Society",
  },
  {
    titleEn: "Hubei College Student Mathematics Competition, First Prize",
    titleZh: "湖北省大学生数学竞赛一等奖",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2018-11",
    awardingOrganization: "Hubei Mathematical Society",
  },
  {
    titleEn: "National Zhou Peiyuan College Student Mechanics Competition, Meritorious Award",
    titleZh: "全国周培源大学生力学竞赛优秀奖",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2017-08",
    awardingOrganization: "Ministry of Education, PRC",
  },
  {
    titleEn: "National College Student English Competition, Second Prize",
    titleZh: "全国大学生英语竞赛二等奖",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2019-05",
    awardingOrganization: "IATEFL",
  },
  {
    titleEn: "Hubei College Student Mechanical Innovation Design Competition, Meritorious Award",
    titleZh: "湖北省大学生机械创新设计大赛优秀奖",
    recipients: "Yi Cao, Jinjiang Xu, Xiaobo Liu, Jianhua Yin, Chaoyi He, Zhiyuan Chen, Dongfang Pan / 曹毅、徐锦江、刘晓波、尹建华、何超逸、陈志远、潘东芳",
    date: "2016-12",
    awardingOrganization: "Wuhan University of Science and Technology",
  },
];

const honorRecords: Award[] = [
  {
    titleEn: "Tsinghua Friends–Weihai Talent Scholarship",
    titleZh: "清华之友-威海英才奖学金",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2023-12",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "Tsinghua Graduate Social Practice Outstanding Scholarship",
    titleZh: "清华大学研究生社会实践优秀奖学金（优秀个人）",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2023-12",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "Gold Award Graduate Practice Team",
    titleZh: "清华大学博士生实践金奖支队（BG支队，队长）",
    recipients: "BG team / 陈志远（队长）",
    date: "2023-11",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "Pan Jiluan Academician Scholarship",
    titleZh: "清华大学潘际銮院士奖学金",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2024-10",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "Tsinghua University 777th (Department of Mechanical Engineering) PhD Academic Forum, Outstanding Oral Presentation",
    titleZh: "清华大学第777期（机械系）博士生学术论坛优秀口头报告",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2025",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "Tsinghua University Outstanding Summer Practice Project",
    titleZh: "清华大学高端装备暑期实践优秀项目",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2019-08",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "Samsung Scholarship",
    titleZh: "清华之友-三星奖学金",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2021-06",
    awardingOrganization: "Samsung Electronics China",
  },
  {
    titleEn: "Tsinghua Comprehensive Outstanding First-Class Scholarship",
    titleZh: "清华大学综合优秀一等奖学金",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2020-12",
    awardingOrganization: "Tsinghua University",
  },
  {
    titleEn: "TTI First-Class Scholarship",
    titleZh: "TTI创科奖学金一等奖",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2017-10",
    awardingOrganization: "Techtronic Industries (TTI)",
  },
  {
    titleEn: "National Scholarship (three consecutive years)",
    titleZh: "国家奖学金（连续三年）",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2016-11, 2017-11, 2018-11",
    awardingOrganization: "Ministry of Education, PRC",
  },
  {
    titleEn: "Hubei College Student Self-Improvement Star",
    titleZh: "湖北省大学生自强之星",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2019-09",
    awardingOrganization: "Hubei Provincial Committee of the Communist Youth League and Hubei Students' Federation Secretariat",
  },
  {
    titleEn: "Top Ten Charming Students",
    titleZh: "武汉科技大学‘十大魅力学子’荣誉称号",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2019-05",
    awardingOrganization: "Wuhan University of Science and Technology",
  },
  {
    titleEn: "Outstanding 3D Association President",
    titleZh: "武汉科技大学校级‘3D协会’优秀会长",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2017-05",
    awardingOrganization: "Wuhan University of Science and Technology",
  },
  {
    titleEn: "Tsinghua University Three-Star Volunteer",
    titleZh: "清华大学三星级志愿者",
    recipients: "Zhiyuan Chen / 陈志远",
    date: "2024-05",
    awardingOrganization: "Tsinghua University",
  },
];

const awardDateValue = (date?: string) => {
  const dates = date?.match(/\d{4}(?:-\d{2})?(?:-\d{2})?/gu) ?? [];
  const latestDate = dates.at(-1);
  return latestDate ? latestDate.padEnd(10, "-00") : "0000-00-00";
};

export const competitionAwards = [...competitionAwardRecords].sort((a, b) =>
  awardDateValue(b.date).localeCompare(awardDateValue(a.date)),
);

export const selectedHonors = [...honorRecords].sort((a, b) =>
  awardDateValue(b.date).localeCompare(awardDateValue(a.date)),
);
