/* Bilingual content. Measured claims are grounded in the supplied v4 CVs.
   DEFormer and research details use the owner-supplied manuscripts.
   The Alibaba two-stage narrative incorporates Jason's October 12 clarification.
   The 14-day horizon is an example; no new measured results are inferred. */
const T = (zh, en) => ({ zh, en });
// Figures and exact Table 1 / Table 2 values from the supplied AAAI manuscript.
const deformerStudy = {
  figures: {
    diagnosis:{number:1,src:"assets/deformer/figure-1-rank-diagnosis.png",width:848,height:714,
      title:T("浅层诊断：初始化与高 / 低 ACF", "Shallow-layer diagnosis: initialization and high / low ACF"),
      note:T("论文图 1 · 对照 point-wise Transformer 与 PatchTST 的三层表征；高、低 ACF 按预测窗内平均 ACF 的 0.5 阈值划分", "Paper Figure 1 · Three-layer diagnostics for point-wise Transformer and PatchTST; high / low ACF is split at a mean ACF of 0.5 over the forecast horizon")},
    tokenization:{number:2,src:"assets/deformer/figure-2-tokenization.png",width:634,height:243,
      title:T("De-correlative Tokenization", "De-correlative Tokenization"),
      note:T("论文图 2 · 原始输入与一阶差分分别缩放、进行带符号的对数变换，再经两组线性投影相加", "Paper Figure 2 · Raw inputs and first differences are scaled, transformed with signed logarithms, then combined through separate linear projections")},
    multitask:{number:3,src:"assets/deformer/figure-3-multitask.png",width:522,height:350,
      title:T("De-autoregressive Multi-task Training", "De-autoregressive Multi-task Training"),
      note:T("论文图 3 · Transformer 后接 MMoE；回归与分类分支分别使用 MSE 和 Focal Loss，共同参与反向传播", "Paper Figure 3 · MMoE follows the Transformer; regression and classification use MSE and Focal Loss and jointly contribute to back-propagation")},
    rank:{number:5,src:"assets/deformer/figure-5-stable-rank.png",width:855,height:419,
      title:T("注意力稳定秩：分层、分 ACF 比较", "Attention stable rank by layer and ACF condition"),
      note:T("论文图 5 · DEFormer 与 PatchTST 在高 / 低 ACF 条件下的稳定秩分布；更高的稳定秩反映更丰富的注意力模式", "Paper Figure 5 · Stable-rank distributions for DEFormer and PatchTST under high / low ACF; higher stable rank reflects more diverse attention patterns")},
    similarity:{number:6,src:"assets/deformer/figure-6-token-similarity.png",width:862,height:419,
      title:T("Token 相似度：检查表征同质化", "Token similarity: checking representation homogenization"),
      note:T("论文图 6 · 比较各层 token 余弦相似度分布；更低的相似度表示 token 表征更易区分", "Paper Figure 6 · Layer-wise token cosine-similarity distributions; lower similarity indicates more distinguishable representations")},
    acf:{number:7,src:"assets/deformer/figure-7-acf-distance.png",width:778,height:378,
      title:T("高 / 低 ACF 的分布差异", "Distribution differences between high / low ACF"),
      note:T("论文图 7 · 用 Kolmogorov–Smirnov 距离比较两种 ACF 条件下的稳定秩与 token 相似度；DEFormer 的分布差异更小", "Paper Figure 7 · Kolmogorov–Smirnov distances compare rank and token-similarity distributions across ACF conditions; DEFormer shows smaller differences")},
  },
  // Row order: model, MAPE, wMAPE, sample coverage, weighted sample coverage.
  datasets:[
    {id:"small",name:"Small",items:4500,
      comparison:[
        ["DEFormer",.375,.255,.813,.808],["PatchTST",.401,.292,.794,.773],
        ["Transformer",.433,.308,.768,.742],["iTransformer",.433,.307,.764,.743],
        ["HDMixer",.452,.321,.766,.735],["DLinear",.458,.319,.742,.724],["Naive",.896,.542,.480,.455]
      ],
      ablation:[
        ["DEFormer",.375,.255,.813,.808],["w/o De-corr",.395,.275,.798,.783],
        ["w/o De-auto",.397,.284,.800,.783],["w/o Both (PatchTST)",.401,.292,.794,.773],
        ["Naive",.896,.542,.480,.455]
      ]},
    {id:"large",name:"Large",items:9000,
      comparison:[
        ["DEFormer",.383,.251,.811,.816],["PatchTST",.392,.266,.806,.804],
        ["Transformer",.458,.295,.759,.756],["iTransformer",.432,.295,.772,.760],
        ["HDMixer",.440,.325,.739,.720],["DLinear",.447,.322,.741,.714],["Naive",.897,.541,.483,.455]
      ],
      ablation:[
        ["DEFormer",.383,.251,.811,.816],["w/o De-corr",.391,.260,.807,.808],
        ["w/o De-auto",.397,.264,.805,.807],["w/o Both (PatchTST)",.392,.266,.806,.804],
        ["Naive",.897,.541,.483,.455]
      ]},
  ],
};
// Research tables preserve the supplied manuscript versions and metric definitions.
const windResearchStudy = {
  sourceNote:T("实验数据来自所提供的 2023 年修订稿（Tables II–IV）；下表选列 MAPE，文中比率换算为百分比显示", "Experiments use the supplied 2023 revision (Tables II–IV). Tables below select MAPE, converting the paper’s ratios to percentages"),
  figures:[
    {number:1,src:"assets/research/fedgin-figure-1-cplf.png",width:2096,height:965,
      title:T("CPLF：共享空间模块，时间模型保留本地", "CPLF: shared spatial modules, local temporal models"),
      note:T("修订稿原图 1 · 各场站本地训练 GIN，仅上传加密的空间模块参数；Encoder–Decoder 保留本地，末轮再进行本地微调", "Revision Figure 1 · Farms train GIN locally, exchange encrypted spatial-module parameters, retain local Encoder–Decoders, and fine-tune locally in the final round")},
    {number:2,src:"assets/research/fedgin-figure-2-gin.png",width:1671,height:1317,
      title:T("GIN：图特征推理与时间编码解码", "GIN: graph feature inference and temporal encoding/decoding"),
      note:T("修订稿原图 2 · 位置与时间嵌入配合 SiDGI 图特征模块，为本地 Encoder–Decoder 提供时空表征", "Revision Figure 2 · Positional and temporal embeddings work with SiDGI graph features to provide spatiotemporal representations for the local Encoder–Decoder")},
    {number:3,src:"assets/research/fedgin-figure-3-sidgi.png",width:1383,height:1200,
      title:T("SiDGI：先学习结构，再校准边权", "SiDGI: learn the structure, then calibrate edge weights"),
      note:T("修订稿原图 3 · 图节点是功率与气象特征；两组可学习嵌入生成有向邻接矩阵，经 top-k 稀疏化后，由多头 GAT 校准边权", "Revision Figure 3 · Nodes are power and meteorological features. Two learnable embeddings form a directed adjacency matrix, top-k selection sparsifies it, and multi-head GAT calibrates edge weights")},
  ],
  summary:[
    {label:T("NW · 1 小时预测", "NW · 1-hour forecast"),value:"−12.4%",note:T("相对 Standalone 的 MAPE 下降", "Relative MAPE reduction vs Standalone")},
    {label:T("SE · 1 小时预测", "SE · 1-hour forecast"),value:"−9.1%",note:T("相对 Standalone 的 MAPE 下降", "Relative MAPE reduction vs Standalone")},
  ],
  tables:[
    {title:T("Table II · 模型对照 · MAPE ↓", "Table II · Model comparison · MAPE ↓"),format:"ratio",headers:[T("模型", "Model"),"30 min","1 h","2 h"],
      groups:[
        {label:T("NW · 8 个风电场", "NW · 8 wind farms"),rows:[
          ["GIN",.0342,.05,.0712],["Informer",.0382,.0528,.0794],["CNN",.0455,.0769,.0961],
          ["GRU",.0647,.0572,.077],["GAT",.035,.0505,.0783],["Autoformer",.241,.435,null],["Transformer",.0391,.0544,.0751]]},
        {label:T("SE · 19 个风电场", "SE · 19 wind farms"),rows:[
          ["GIN",.032,.0487,.0719],["Informer",.0344,.0511,.0737],["CNN",.0646,.0828,.0929],
          ["GRU",.0422,.0558,.0769],["GAT",.0438,.0582,.0751],["Autoformer",.1464,.4947,null],["Transformer",.0337,.0511,.0722]]},
      ],note:T("低 MAPE 更好；Autoformer 的 2 小时结果为显存不足（OOM）。各模型作为联邦实验的本地模型，参数传输方式按修订稿中的模型配置执行", "Lower MAPE is better. Autoformer’s 2-hour runs ran out of memory (OOM). Comparators are local models in federated experiments, with parameter transmission following each model’s configuration in the revision")},
    {title:T("Table III · CPLF 与独立本地训练", "Table III · CPLF versus Standalone"),collapsed:true,format:"ratio",headers:[T("训练方式", "Training setup"),"30 min","1 h","2 h"],
      groups:[
        {label:"NW",rows:[["GIN (CPLF)",.0342,.05,.0712],["GIN (Standalone)",.0394,.0571,.07534]]},
        {label:"SE",rows:[["GIN (CPLF)",.032,.0487,.0719],["GIN (Standalone)",.0369,.0536,.0788]]},
      ],note:T("选列 MAPE；Standalone 使用各场站独立训练，CPLF 通过空间参数聚合协作。上方降幅依据此表的 1 小时结果计算", "MAPE selected. Standalone trains each farm independently; CPLF collaborates through spatial-parameter aggregation. The summary reductions use the 1-hour results here")},
    {title:T("Table IV · SiDGI 模块消融", "Table IV · SiDGI ablations"),collapsed:true,format:"ratio",headers:[T("配置", "Configuration"),"30 min","1 h","2 h"],
      groups:[
        {label:"NW",rows:[["GIN",.0342,.05,.0712],["GIN ⋊",.0391,.0544,.0751],["GIN ⋇",.0415,.0591,.0738],["GIN †",.0561,.0578,.077]]},
        {label:"SE",rows:[["GIN",.032,.0487,.0719],["GIN ⋊",.0337,.0511,.0722],["GIN ⋇",.0352,.051,.0727],["GIN †",.0449,.0545,.0791]]},
      ],note:T("选列 MAPE。⋊：以一维卷积替换 SiDGI；⋇：以图卷积替换 GAT 边权校准；†：以全连接图替换初始动态图生成", "MAPE selected. ⋊: replace SiDGI with 1D convolutions. ⋇: replace GAT calibration with graph convolutions. †: replace learned graph generation with a fully connected graph")},
  ],
};
const priceResearchStudy = {
  sourceNote:T("实验数据来自所提供的作者接收稿：点预测为 Table VIII，区间预测为 Table X，资源评估为 Table IX", "Results use the supplied accepted author manuscript: point forecasts from Table VIII, intervals from Table X, and resources from Table IX"),
  figures:[
    {number:2,src:"assets/research/price-figure-2-framework.png",width:1308,height:1155,
      title:T("从时间特征提取，到两种预测模式", "From temporal features to two forecasting modes"),
      note:T("论文原图 2 · ARUCNN 与 GRU 提取短期和长期依赖，Dense Skip Attention 对特征加权；点预测或区间预测分别选择相应回归损失", "Paper Figure 2 · ARUCNN and GRU extract short- and long-term dependencies; Dense Skip Attention weights features. The regression loss is selected for point or interval forecasting")},
    {number:4,src:"assets/research/price-figure-4-dense-skip.png",width:1395,height:515,
      title:T("Dense Skip Attention 的两条路径", "The two paths in Dense Skip Attention"),
      note:T("论文原图 4 · 主路经 Seq2Seq GRU 与维度置换，在特征轴上计算注意力；旁路经另一 GRU、Dense 与 PReLU，两路输出相加后进入全连接层", "Paper Figure 4 · The main path uses Seq2Seq GRU and permutation for feature-axis attention. A second GRU, Dense and PReLU form the skip path; outputs are summed before the final fully connected layer")},
  ],
  summary:[
    {label:T("瑞典", "Sweden"),value:"5.24%",note:T("Proposed · 点预测 MAPE", "Proposed · Point-forecast MAPE")},
    {label:T("挪威", "Norway"),value:"1.01%",note:T("Proposed · 点预测 MAPE", "Proposed · Point-forecast MAPE")},
    {label:T("丹麦", "Denmark"),value:"4.64%",note:T("Proposed · 点预测 MAPE", "Proposed · Point-forecast MAPE")},
    {label:T("芬兰", "Finland"),value:"7.91%",note:T("Proposed · 点预测 MAPE", "Proposed · Point-forecast MAPE")},
  ],
  tables:[
    {title:T("Table VIII · 点预测 MAPE ↓", "Table VIII · Point-forecast MAPE ↓"),format:"percent",headers:[T("模型", "Model"),T("瑞典", "Sweden"),T("挪威", "Norway"),T("丹麦", "Denmark"),T("芬兰", "Finland")],
      groups:[{rows:[
        ["Proposed",5.24,1.01,4.64,7.91],["GRU",6.79,1.15,5.28,9.40],["UCNN",6.93,1.45,5.55,10.76],
        ["UCNN+GRU",6.12,1.14,5.17,9.13],["UResnet",5.78,1.34,4.93,9.72],["BPNN",10.37,2.86,9.72,12.06],
        ["S2S-Attn",6.99,1.27,5.10,9.34],["Transformer",6.86,1.20,5.18,8.79]]}],
      note:T("选列 MAPE；结果对应 2018–2019 年四国小时数据的实验。特征使用 Pearson 系数 ≥ 0.5 的筛选条件；按时间前 70% 训练、后 30% 测试", "MAPE selected for experiments on four countries’ hourly 2018–2019 data. Features are selected with Pearson coefficient ≥ 0.5; the first 70% trains the model and the final 30% tests it")},
    {title:T("Table X · 区间预测 RWS ↓", "Table X · Interval-forecast RWS ↓"),format:"decimal",headers:[T("模型", "Model"),T("瑞典", "Sweden"),T("挪威", "Norway"),T("丹麦", "Denmark"),T("芬兰", "Finland")],
      groups:[{rows:[
        ["Proposed",.125,.089,.111,.203],["GRU",.197,.175,.264,.419],["UCNN",.198,.150,.166,.216],
        ["UCNN+GRU",.147,.091,.112,.230],["UResnet",.177,.122,.166,.210],["BPNN",.292,.276,.338,.558],
        ["S2S-Attn",.135,.164,.191,.258],["Transformer",.137,.094,.130,.227]]}],
      note:T(String.raw`RWS 为相对 Winkler Score，综合衡量区间宽度与区间外误差，越低越好。论文展示名义 90% 区间，并报告 \(\alpha=0.05\) / \(0.95\) 的两组 MPL`, String.raw`RWS is the relative Winkler Score, combining interval width and out-of-interval error; lower is better. The paper shows nominal 90% intervals and reports MPL at \(\alpha=0.05\) / \(0.95\)`)},
    {title:T(String.raw`Table X · MPL（\(\alpha=0.95\)）↓`, String.raw`Table X · MPL (\(\alpha=0.95\)) ↓`),collapsed:true,format:"decimal",headers:[T("模型", "Model"),T("瑞典", "Sweden"),T("挪威", "Norway"),T("丹麦", "Denmark"),T("芬兰", "Finland")],
      groups:[{rows:[
        ["Proposed",.137,.109,.594,.374],["GRU",.176,.125,.675,.552],["UCNN",.179,.163,.710,.549],
        ["UCNN+GRU",.159,.119,.651,.517],["UResnet",.158,.148,.661,.475],["BPNN",.289,.366,1.306,.693],
        ["S2S-Attn",.179,.148,1.113,.415],["Transformer",.172,.130,.684,.416]]}],
      note:T(String.raw`对应原表的 MPL*；与 \(\alpha=0.05\) 的 MPL** 分开展示`, String.raw`Corresponds to MPL* in the source, shown separately from MPL** at \(\alpha=0.05\)`)},
    {title:T(String.raw`Table X · MPL（\(\alpha=0.05\)）↓`, String.raw`Table X · MPL (\(\alpha=0.05\)) ↓`),collapsed:true,format:"decimal",headers:[T("模型", "Model"),T("瑞典", "Sweden"),T("挪威", "Norway"),T("丹麦", "Denmark"),T("芬兰", "Finland")],
      groups:[{rows:[
        ["Proposed",.126,.104,.536,.372],["GRU",.175,.127,.608,.544],["UCNN",.199,.156,.635,.438],
        ["UCNN+GRU",.147,.120,.607,.408],["UResnet",.149,.144,.621,.455],["BPNN",.330,.292,1.399,.690],
        ["S2S-Attn",.159,.130,1.012,.386],["Transformer",.169,.133,.785,.408]]}],
      note:T("对应原表的 MPL**。MPL 为平均 Pinball Loss，越低越好；两组分位指标分别评估", "Corresponds to MPL** in the source. MPL is mean Pinball Loss; lower is better. The two quantile metrics are evaluated separately")},
    {title:T("Table IX · 精度与计算资源的取舍", "Table IX · Accuracy and resource trade-offs"),collapsed:true,format:"plain",highlight:false,
      headers:[T("模型", "Model"),T("参数量", "Parameters"),T("训练 + 验证（秒）", "Train + validation (s)"),"MAPE"],
      groups:[{rows:[["Proposed",248421,1026.22,"5.24%"],["GRU",179989,772.93138,"6.79%"]]}],
      note:T("瑞典数据集上的资源评估；时间为训练与验证合计。对照 GRU 为七层、各层后接 PReLU；这些数值不代表线上推理延迟", "Resource evaluation on Sweden. Time sums training and validation; the GRU comparator has seven layers, each followed by PReLU. These figures are not inference latency")},
  ],
};
// Project covers use the corresponding detail diagram or original paper figure.
const projectCovers = {
  "project-agent": {
    "src": {
      "zh": "assets/project-covers/project-agent-zh.png",
      "en": "assets/project-covers/project-agent-en.png"
    },
    "width": 1230,
    "height": 302
  },
  "project-wiki": {
    "src": {
      "zh": "assets/project-covers/project-wiki-zh.png",
      "en": "assets/project-covers/project-wiki-en.png"
    },
    "width": 1230,
    "height": 212
  },
  "project-qwen": {
    "src": {
      "zh": "assets/project-covers/project-qwen-zh.png",
      "en": "assets/project-covers/project-qwen-en.png"
    },
    "width": 1230,
    "height": 762
  },
  "project-ring": {
    "src": {
      "zh": "assets/project-covers/project-ring-zh.png",
      "en": "assets/project-covers/project-ring-en.png"
    },
    "width": 1230,
    "height": 226
  },
  "project-hust-review": {
    "src": {
      "zh": "assets/project-covers/project-hust-review-zh.png",
      "en": "assets/project-covers/project-hust-review-en.png"
    },
    "width": 1230,
    "height": 226
  },
  "project-deformer": {
    "src": "assets/deformer/figure-2-tokenization.png",
    "width": 634,
    "height": 243
  },
  "project-hust-wind": {
    "src": "assets/research/fedgin-figure-1-cplf.png",
    "width": 2096,
    "height": 965
  },
  "project-hust-price": {
    "src": "assets/research/price-figure-2-framework.png",
    "width": 1308,
    "height": 1155
  }
};
const portfolio = {
  name: T("丁逸洲", "Yizhou Ding"),
  alias: "Jason",
  email: "jasondean910@outlook.com",
  scholar: "https://scholar.google.com.hk/citations?user=ei8WkXgAAAAJ&hl=en",
  tagline: T("用大模型、预测与 Agent，将真实业务问题转化为可用的解决方案", "I turn real-world problems into practical solutions with language models, forecasting and agents"),
  ui: {
    skip: T("跳到主要内容", "Skip to main content"),
    nav: [T("经历", "Experience"), T("项目", "Projects"), T("技能", "Skills"), T("教育", "Education")],
    portfolio: T("个人作品与经历", "Selected work & experience"),
    explore: T("探索我的经历", "Explore my work"),
    sayHello: T("联系我", "Get in touch"),
    glance: T("经历概览", "At a glance"),
    agenda: T("讲解目录", "On this page"),
    headline: T("AI 算法工程师", "AI Algorithm Engineer"),
    contextDetails: T("业务背景与职责", "Context & responsibilities"),
    stories: T("重点经历", "Selected stories"),
    storyNotes: T("讲解补充 · 挑战与行动", "Speaker notes · challenge & actions"),
    expandNotes: T("展开全部讲解", "Open all notes"),
    collapseNotes: T("收起全部讲解", "Close all notes"),
    backTop: T("回到顶部", "Back to top"),
    workTitle: T("工作与研究经历", "Work & research"),
    workDesc: T("从真实问题出发，连接技术选择与业务结果", "Connecting technical decisions with real-world outcomes"),
    projectTitle: T("精选项目", "Selected projects"),
    projectDesc: T("四个项目，关于建模、系统与产品的具体实践", "Four explorations in modeling, systems and product development"),
    skillsTitle: T("技能与方法", "Skills & methods"),
    skillsDesc: T("围绕建模、系统与反馈验证组织的技术工具箱", "A toolkit for modeling, building workflows and learning from feedback"),
    educationTitle: T("教育与学术", "Education & scholarship"),
    educationDesc: T("人工智能、工程与时序预测的交叉训练", "A foundation across artificial intelligence, engineering and time-series forecasting"),
    contactTitle: T("欢迎继续交流", "Let’s continue the conversation"),
    contactDesc: T("关于 AI 应用、Agent 工作流、时序预测，以及从问题定义到交付的实践", "About applied AI, agent workflows, forecasting and the journey from problem definition to delivery"),
    contact: T("联系方式", "Contact"),
    background: T("业务与团队背景", "Business & team context"),
    responsibility: T("我的职责", "My responsibilities"),
    storyJump: T("重点故事", "Key stories"),
    problem: T("问题与挑战", "Problem & challenge"),
    action: T("我的行动", "My actions"),
    result: T("结果与影响", "Results & impact"),
    takeaway: T("技术亮点与思考", "Technical takeaway"),
    stack: T("技术与方法", "Tools & methods"),
    expand: T("展开", "Expand"),
    collapse: T("收起", "Collapse"),
    expandAll: T("展开全部", "Expand all"),
    collapseAll: T("收起全部", "Collapse all"),
    role: T("我的角色", "My role"),
    context: T("背景与目标", "Context & objective"),
    challenge: T("核心挑战", "The challenge"),
    decisions: T("方案与技术决策", "Approach & decisions"),
    learnings: T("收获与思考", "What I take from this"),
    viewProject: T("项目详解", "Project deep dive"),
    workLink: T("关联经历", "Related experience"),
    process: T("工作流程", "Workflow"),
    selectedPapers: T("代表性论文", "Selected publications"),
    allPapers: T("完整论文列表", "Full publication list"),
    publicationNote: T("DEFormer 为已投稿论文；其余所列成果已发表", "DEFormer is a submitted manuscript; the other listed works are published"),
    source: T("依据简历与本人补充整理 · 指标均注明比较基线", "Based on the CVs and personal clarifications · Metric baselines are stated"),
    readMore: T("继续了解", "Read more"),
    projectCount: T("04 个项目", "04 projects"),
    fulltime: T("全职", "Full-time"),
    internship: T("实习 / 创业实践", "Internship / startup"),
    research: T("科研", "Research"),
  },
  glance: [
    {time:"2024 — 2026",title:T("阿里巴巴", "Alibaba"),desc:T("AI 算法 · 营销与增长", "AI algorithms · Marketing & growth"),target:"alibaba"},
    {time:"2024",title:T("深圳科创学院", "Shenzhen InnoX"),desc:T("产品定义 · 智能硬件", "Product definition · Smart hardware"),target:"innox"},
    {time:"2021 — 2024",title:T("华中科技大学 & 巴黎文理大学", "HUST & PSL University"),desc:T("联合培养 · 时序预测与新能源研究", "Joint training · Forecasting & renewable power"),target:"hust"},
  ],
  experience: [
    {
      id:"alibaba", index:"01", kind:"fulltime",
      company:T("阿里巴巴", "Alibaba Group"),
      entity:T("浙江天猫技术有限公司 · 营销算法团队", "Zhejiang Tmall Technology Co., Ltd. · Marketing Algorithms Team"),
      role:T("AI 算法工程师", "AI Algorithm Engineer"), date:"2024.07 — 2026.08",
      overview:T("两年工作沿着一条主线展开：先优化单个营销周期的价量预测，支持短期 GMV 最大化；再复用预测能力，支持更长周期的商品成长规划", "Over two years, my work progressed from price–sales forecasting for single-cycle GMV optimization to reusing that capability for longer-term product growth planning"),
      focus:[T("价量预测", "Price–sales forecasting"), T("短期增长", "Near-term growth"), T("长期商品成长", "Long-term product growth")],
      strategy:{
        title:T("从短期交易增长，到长期商品成长", "From near-term GMV to long-term product growth"),
        goalLabel:T("业务目标", "Objective"),
        contributionLabel:T("我的贡献", "My contribution"),
        phases:[
          {
            id:"ali-short-term",number:"01",
            horizon:T("单个营销周期 · 以未来 14 天为例", "One marketing cycle · e.g. the next 14 days"),
            title:T("提升预测质量，支持短期 GMV 最大化", "Better forecasts for single-cycle GMV optimization"),
            goal:T("预估不同价格下的销量，为促销定价提供依据，优化当期交易额", "Forecast sales at different prices to inform promotional pricing and optimize GMV within the cycle"),
            contribution:T("围绕 PatchTST 提升泛化能力；提出 DEFormer 缓解 Transformer 秩坍缩，并推进条件表征与推理稳定性优化", "Improved forecasting generalization from a PatchTST baseline: proposed DEFormer to mitigate rank collapse, and refined conditional representations and inference stability"),
            result:T("项目累计 GMV +5.06%", "Cumulative project GMV +5.06%"),
            resultNote:T("多轮迭代相对初始版本的整体结果", "Overall result across iterations versus the initial version"),
            links:[
              {target:"project-deformer",label:T("DEFormer 研究", "DEFormer research"), action:T("提出 DEFormer 缓解 Transformer 秩坍缩，提升 PatchTST 基线的泛化能力", "Proposed DEFormer to mitigate Transformer rank collapse and improve generalization over PatchTST")},
              {target:"project-qwen",label:T("表征与推理优化", "Representations & inference"), action:T("融合 Qwen3 条件表征与后训练，优化预测误差和线上推理稳定性", "Integrated Qwen3 representations and post-training to improve forecast accuracy and inference stability")},
            ],
          },
          {
            id:"ali-long-term",number:"02",
            horizon:T("跨营销周期 · 高潜孵化与防滑落", "Across cycles · Incubation & growth-tier retention"),
            title:T("复用预测能力，规划商品长期成长", "Reuse forecasting to plan longer-term growth"),
            goal:T("面向高潜商品孵化与成长层级防滑落，规划商品在更长周期内的运营路径", "Plan longer-term interventions to incubate high-potential products and help products retain their growth tier"),
            contribution:T("以短期优化模型作为 baseline，结合商品状态与历史反馈，串联商品评估、运营建议和持续迭代", "Used the improved short-term model as a baseline, combining product state and past feedback in a recurring assessment and recommendation workflow"),
            result:T("高潜孵化与防滑落 · 两期线上 A/B", "Growth & retention · Two online A/B phases"),
            resultNote:T("以建议采纳率和阶段性 GMV 增长评估项目效果", "Evaluated adoption and phase-level GMV growth at project level"),
            links:[{target:"project-agent",label:T("高潜商品孵化与防滑落", "Product growth & retention"), action:T("复用预测 baseline，结合商品状态与历史反馈，串联评估、运营建议与持续迭代", "Reused the forecasting baseline with product state and feedback in an ongoing assessment and recommendation workflow")}],
          },
        ],
        bridgeLabel:T("两阶段如何承接", "How the stages connect"),
        bridge:T("优化后的价量预测模型，成为长期成长项目的 baseline", "The improved price–sales forecaster becomes the baseline for longer-term growth planning"),
      },
      background:T("团队的工作围绕电商营销中的商品增长、促销定价与补贴资源配置展开。销量预测在这里需要进入运营决策：判断哪些商品值得投入、如何配置价格与资源，以及怎样用反馈修正下一轮方案", "The team worked on product growth, promotional pricing and subsidy allocation in e-commerce marketing. Forecasts fed into operating decisions: which products merit support, how prices and resources should be configured, and how feedback should inform the next round"),
      responsibilities:T("我的工作连接模型与业务工作流：研发与评估销量预测模型，开展 Qwen3 表征融合及后训练，处理线上推理稳定性问题；同时集成预测工具、运营反馈、记忆与人工审核，并主导 Transformer 秩坍缩的机制研究与方法验证", "My work connected modeling with operating workflows: developing and evaluating forecasters, adapting Qwen3 representations, addressing inference stability, and integrating forecasting tools, feedback, memory and human review. I also led diagnosis and experimental validation of rank collapse in time-series Transformers"),
      stories: [
        {
          id:"ali-agent", title:T("让预测模型进入持续迭代的运营工作流", "Turning forecasts into an iterative operating workflow"),
          brief:T("从商品评估，到建议、执行反馈与跨轮次记忆", "From product assessment to recommendations, feedback and cross-round memory"),
          problem:T("高潜商品与存在成长层级滑落风险的商品，需要不同的运营方案。一次销量预测只能提供部分判断依据，后续决策还要结合营销、广告和搜索曝光信号，并理解过去一轮运营后的变化", "Products with growth potential and products at risk of falling to a lower growth tier need different interventions. A sales forecast provides only part of the decision context; marketing, advertising and search exposure signals, as well as the previous round’s outcomes, also matter"),
          actions:[
            T("将既有价量预测模型封装为可调用工具，把当前商品状态、相关信号与销量预测放到同一评估流程中，用于判断成长潜力和层级维持风险", "I exposed existing price–sales models as callable tools and brought product state, operating signals and sales forecasts into a shared assessment workflow for growth potential and retention risk"),
            T("串联商品评估、运营决策、执行、反馈和记忆更新；存储各轮运营结果，并在下一轮检索历史反馈，与当前商品状态共同形成目标判断和营销建议", "I connected assessment, operating decisions, execution, feedback and memory updates. Round-level outcomes were stored and retrieved alongside the current product state to inform subsequent objectives and recommendations"),
            T("实现重试与回退，并让运营建议进入人工审核。对于促销价格与广告预算联合配置，完成基线归一化和 GMV(B,P) 结构设计，明确适用范围、标定与回退条件；联合变化样本的结构验证仍处于规划阶段", "I implemented retries, fallbacks and human review of recommendations. For joint price–budget planning, I designed baseline normalization and a GMV(B,P) formulation with applicability, recalibration and fallback criteria. Structural validation on samples with simultaneous price and budget changes remained planned"),
          ],
          result:T("项目完成两期线上 A/B 实验，建议采纳率分别为 26.6% 和 39.3%；实验组 GMV 增幅较各自对照组分别高 65.2% 和 27.7%。这些是项目整体效果，不单独归因于某个 Agent 模块", "The project completed two online A/B phases. Recommendation adoption was 26.6% and 39.3%; treatment-group GMV growth was 65.2% and 27.7% higher than the respective controls. These are overall project results, without separate attribution to an individual agent component"),
          takeaway:T("这个经历的关键是把模型输出接到可持续运行的业务闭环：工具负责提供预测依据，记忆保留反馈，可靠性机制与人工审核支持建议落地", "The central engineering idea is a repeatable feedback loop: tools supply forecasting evidence, memory preserves outcomes, and reliability mechanisms and human review support operational recommendations"),
          stack:["Tool Calling","Workflow","Feedback & Memory",T("重试与回退","Retry & Fallback"),T("人工审核","Human Review")],
          project:"project-agent",
        },
        {
          id:"ali-forecast", title:T("同时改善预测误差与线上输出稳定性", "Improving forecasting accuracy and inference stability"),
          brief:T("任务表征、后训练与推理稳定性，分别定义目标与基线", "Separate objectives and baselines for representations, post-training and stability"),
          problem:T("商品信息、促销条件与价格变化提供了数值序列以外的上下文。模型需要理解这些条件，同时线上预测还存在同一样本跨批次不一致、相近输入输出过度敏感的问题；误差与稳定性需要分开衡量", "Product information, promotion conditions and price changes add context beyond numerical history. The model needed to use that context while also addressing cross-batch inconsistency and excessive sensitivity to similar inputs. Forecasting error and stability required separate evaluation"),
          actions:[
            T("使用冻结的 Qwen3-4B 编码条件信息，经门控机制与时序表征融合。之后基于六类销量变化标签开展 LoRA SFT，接入适配后的表征并重新训练下游预测模型", "I encoded conditional information with frozen Qwen3-4B and fused it with time-series representations through a gate. I then used six sales-change labels for LoRA SFT, integrated the adapted representations and retrained the downstream forecaster"),
            T("从同一 SFT 基线比较 RLVR（GRPO）与 OPD：前者以销量变化标签正确性作为可验证奖励，后者利用同任务适配教师的概率指导学生采样输出。两条路线均通过重新训练下游预测器评估", "I compared RLVR with GRPO and OPD from the same SFT baseline: RLVR used sales-change label correctness as a verifiable reward; OPD used a task-adapted teacher’s probabilities on student-sampled outputs. Both were evaluated after retraining the downstream forecaster"),
            T("为线上推理引入 Monte Carlo Dropout，多次随机采样后取均值；分别以逐样本跨批次 CV 和受控输入扰动后的相对变化，评估输出一致性与敏感性", "For production inference, I introduced repeated Monte Carlo Dropout sampling with mean aggregation. I evaluated consistency with per-sample cross-batch CV and sensitivity with relative prediction changes under controlled input perturbations"),
          ],
          result:T("冻结 Qwen 表征使 wMAPE 相对下降 2.1%；SFT 相较冻结表征下降 3.7%，大促跃升样本下降 6.2%；RLVR / OPD 相较同一 SFT 基线分别下降 2.9% / 3.1%。稳定性两项指标分别下降 11% / 10%。项目多轮迭代相较初始版本，GMV / 子订单数 / GMV 覆盖率累计提升约 5.06% / 5.50% / 4.51%", "Frozen Qwen representations reduced wMAPE by 2.1%. SFT improved it by 3.7% overall and 6.2% on promotion-driven jumps versus frozen representations; RLVR and OPD improved it by 2.9% and 3.1% versus the same SFT baseline. The two stability measures improved by 11% and 10%. Across project iterations, cumulative GMV, sub-order count and GMV coverage rose approximately 5.06%, 5.50% and 4.51% versus the initial version"),
          takeaway:T("后训练的标签任务表现，需要通过下游预测重新验证；模型误差、推理稳定性与项目整体线上效果，也应使用各自的评估口径", "Post-training on the label task must be evaluated again in downstream forecasting. Model error, inference stability and overall online project impact each need their own measurement and baseline"),
          stack:["Qwen3-4B","LoRA SFT","RLVR / GRPO","OPD","Monte Carlo Dropout"],
          project:"project-qwen",
        },
        {
          id:"ali-deformer", title:T("从表征诊断出发，解释并缓解秩坍缩", "Diagnosing and mitigating rank collapse"),
          brief:T("2025.07 — 2026.07 · DEFormer 研究，连接机制与业务评估", "2025.07 — 2026.07 · DEFormer research, connecting mechanism and evaluation"),
          problem:T("销量序列的强自相关可能使 Transformer 更依赖重复的时序模式，导致注意力退化、token 表征趋同和泛化不足。仅查看最终预测误差，不足以解释问题出现在何处", "Strong autocorrelation in sales histories can encourage reliance on repetitive temporal patterns, leading to degraded attention, similar token representations and limited generalization. End-point prediction error alone does not locate the representation problem"),
          actions:[
            T("主导问题诊断与成因分析，结合注意力矩阵稳定秩和 token 余弦相似度，分析不同层深与输入自相关强度下的退化，发现浅层也可能发生秩坍缩", "I led diagnosis and root-cause analysis using attention stable rank and token cosine similarity across depths and autocorrelation levels, finding that collapse can emerge even in shallow layers"),
            T("提出 DEFormer：用原始序列与一阶差分构建去相关编码，结合对数比值目标变换及回归、分类多任务训练，并通过逐模块消融和跨层分析验证表征变化", "I proposed DEFormer: a decorrelation encoder combining raw histories and first-order differences, with a log-ratio target transformation and joint regression/classification training. Component ablations and cross-layer analysis checked how the representations changed"),
          ],
          result:T("在约 4,500 与 9,000 件商品的两个真实零售数据集上，相较 PatchTST，wMAPE 分别从 0.292 降至 0.255、从 0.266 降至 0.251，相对下降 12.7% 与 5.6%；销量加权覆盖率分别从 77.3% 升至 80.8%、从 80.4% 升至 81.6%，提升 3.5 与 1.2 个百分点。研究形成 DEFormer 论文，已于 2026 年投稿", "On two real-world retail datasets with approximately 4,500 and 9,000 products, wMAPE fell from 0.292 to 0.255 and from 0.266 to 0.251 versus PatchTST: relative reductions of 12.7% and 5.6%. Weighted sample coverage rose from 77.3% to 80.8% and from 80.4% to 81.6%, gains of 3.5 and 1.2 percentage points. The work resulted in the DEFormer manuscript, submitted in 2026"),
          takeaway:T("机制研究需要形成可检验的链条：输入性质 → 注意力与表征诊断 → 方法设计 → 消融验证 → 预测与业务指标", "A mechanism claim needs a testable chain: input properties, attention and representation diagnostics, method design, ablations, and forecasting and business-oriented metrics"),
          stack:["Transformer","Stable Rank",T("一阶差分","First-order Differences"),T("多任务学习","Multitask Learning"),"PatchTST"],
          project:"project-deformer",
        },
      ],
    },
    {
      id:"innox",index:"02",kind:"internship",
      company:T("深圳科创学院", "Shenzhen InnoX Academy"),
      shortCompany:T("深圳科创学院", "Shenzhen InnoX"),
      entity:T("创业孵化器 · 智能戒指初创团队", "Startup incubator · Smart-ring venture"),
      role:T("初级产品经理（实习）", "Junior Product Manager Intern"),date:"2024.01 — 2024.06",
      overview:T("参与智能戒指从概念到首代样机的产品开发，通过 200+ 用户访谈定义需求，并协同软硬件工程师和天使用户推进原型验证与迭代", "Helped take a smart ring from concept to its first prototype, defining requirements through 200+ user interviews and coordinating engineering work, early-adopter testing and iteration"),
      focus:[T("用户研究", "User Research"), T("产品定义", "Product Definition"), T("智能硬件", "Smart Hardware")],
      strategy:{
        title:T("从用户需求，到可验证的首代产品", "From user needs to a testable first product"),
        goalLabel:T("产品目标", "Product objective"), contributionLabel:T("我的贡献", "My contribution"),
        phases:[
          {
            id:"innox-discovery",number:"01",
            horizon:T("概念探索 · 需求与可行性", "Discovery · Needs & feasibility"),
            title:T("明确用户需求，定义首代产品范围", "Define user needs and first-generation scope"),
            goal:T("识别智能戒指的健康监测需求，在用户优先级与工程约束之间确定首代方案", "Identify health-monitoring needs and define a first-generation smart ring around user priorities and engineering constraints"),
            links:[{target:"project-ring",view:"innox-definition",label:T("用户研究与产品定义", "User research & product definition"),action:T("开展 200+ 用户访谈，规划核心功能与原型，并与软硬件工程师共同评估可行性", "Conducted 200+ interviews, planned core features and prototypes, and assessed feasibility with software and hardware engineers")}],
            result:T("200+ 用户访谈 → 首代样机方案", "200+ interviews → First-prototype plan"),
            resultNote:T("形成需求、功能优先级与原型方案，推进首代样机开发", "Produced requirements, feature priorities and prototypes to advance the first-generation product"),
          },
          {
            id:"innox-iteration",number:"02",
            horizon:T("样机验证 · 反馈与交付", "Validation · Feedback & delivery"),
            title:T("连接用户反馈，推进跨团队迭代", "Connect user feedback to cross-team iteration"),
            goal:T("让真实使用反馈进入下一轮产品决策，并协调研发与运营推进核心里程碑", "Bring real user feedback into the next product decisions and align engineering and operations around core milestones"),
            links:[{target:"project-ring",view:"innox-delivery",label:T("用户验证与交付协同", "User validation & delivery"),action:T("建立 200+ 天使用户社群，组织样机测试与反馈，并协调内部研发和外部运营资源", "Built a 200+ early-adopter community, organized prototype testing and feedback, and coordinated engineering and operations")}],
            result:T("半年内核心里程碑 · 种子轮投资", "Core milestones within six months · Seed funding"),
            resultNote:T("团队完成交付，项目获得孵化器投资；我的贡献聚焦用户反馈与资源协调", "Team-level delivery and incubator funding; my contribution focused on user feedback and resource coordination"),
          },
        ],
        bridgeLabel:T("从定义走向验证", "From definition to validation"),
        bridge:T("把首代方案交给真实用户测试，再让反馈进入下一轮产品讨论", "Test the first-generation plan with real users, then carry feedback into the next product discussion"),
      },
      background:T("项目处于从概念走向首代样机的阶段，围绕智能戒指的健康监测需求开展产品探索。这个阶段的核心是把用户表达转成清晰的功能优先级，同时协调软件、硬件与测试反馈", "The venture was moving from a smart-ring concept to its first prototype, exploring health-monitoring needs. The work required translating user input into feature priorities while coordinating software, hardware and prototype feedback"),
      responsibilities:T("主导用户调研、需求定义与原型规划，参与技术可行性评估；组织天使用户测试与反馈，协同软硬件工程师及外部运营资源推进半年内的核心里程碑", "I led user research, requirement definition and prototype planning, and worked on technical feasibility assessments. I organized early-adopter testing and feedback, coordinating software and hardware engineers and external operating resources toward the six-month milestones"),
      stories:[
        {
          id:"innox-definition",title:T("把 200+ 用户访谈转化为产品优先级", "Translating 200+ interviews into product priorities"),
          brief:T("从开放的需求探索，走向可讨论、可开发的首代方案", "From open-ended discovery to a first-generation product plan"),
          problem:T("智能戒指的概念可以承载多种健康监测需求，但首代产品需要明确要解决什么、先做什么，以及技术上能否实现。产品定义需要同时理解用户场景和工程约束", "A smart-ring concept can cover many health-monitoring needs. A first-generation product requires clear choices about which needs to address first and whether those choices are technically feasible. Product definition must connect user context with engineering constraints"),
          actions:[
            T("开展市场调研与 200+ 用户访谈，整理健康监测需求与优先级，并将这些输入转为核心功能规划和原型设计", "I conducted market research and 200+ user interviews, organized health-monitoring requirements and priorities, and translated them into feature plans and prototypes"),
            T("与软硬件工程师协作开展技术可行性评估，让需求讨论与开发方案相互校验，推进从概念到首代样机的工作", "I worked with software and hardware engineers on feasibility assessments, connecting requirement discussions to development choices as the concept moved toward a first prototype"),
          ],
          result:T("形成面向首代智能戒指的需求、功能与原型方案，基于 200+ 用户访谈推进首代样机开发", "The work produced requirements, feature plans and prototypes for a first-generation smart ring, advancing prototype development with input from 200+ user interviews"),
          takeaway:T("产品定义的价值在于把用户语言转成工程团队可以讨论和验证的选择，并使需求优先级与技术可行性共同约束首代范围", "Product definition turns user language into choices that engineers can discuss and validate, with both priorities and feasibility shaping the first-generation scope"),
          stack:[T("用户访谈","User Interviews"),T("需求定义","Requirements"),T("原型设计","Prototyping"),T("技术可行性","Feasibility")],
          project:"project-ring",
        },
        {
          id:"innox-delivery",title:T("组织早期用户反馈，推进跨团队交付", "Coordinating early feedback and cross-functional delivery"),
          brief:T("200+ 天使用户社群 · 半年内完成核心里程碑", "200+ early adopters · Core milestones within six months"),
          problem:T("从样机开发到迭代，需要持续获得真实使用反馈，也需要让内部研发和外部运营围绕同一组里程碑协作。用户反馈只有进入下一轮产品讨论，才能成为有效输入", "Prototype development and iteration require ongoing user feedback and coordination between internal engineering and external operations. Feedback becomes useful when it enters the next round of product decisions"),
          actions:[
            T("建立 200+ 人天使用户社群，组织原型测试、反馈收集和敏捷迭代，把产品探索延伸到可持续的反馈渠道", "I built a community of 200+ early adopters and organized prototype testing, feedback collection and agile iteration, creating a continuing channel for product learning"),
            T("协调内部研发与外部运营资源，围绕核心里程碑推进测试和开发，让跨团队沟通与产品迭代保持一致", "I aligned internal development and external operating resources around core milestones, connecting cross-functional communication with testing and product iteration"),
          ],
          result:T("建立 200+ 人天使用户反馈渠道，团队在半年内完成核心里程碑，项目获得孵化器种子轮投资", "The work established a feedback channel with 200+ early adopters. The team completed core milestones within six months and the project secured seed investment from the incubator"),
          takeaway:T("交付不仅依赖需求文档，也依赖稳定的反馈渠道与资源协调。这个经历让我把产品定义、工程讨论和用户验证放在同一条工作链中", "Delivery depends on feedback channels and resource coordination as well as requirements. This experience connected product definition, engineering discussions and user validation within one working loop"),
          stack:[T("用户社群","Early-adopter Community"),T("原型测试","Prototype Testing"),T("敏捷迭代","Agile Iteration"),T("跨团队协作","Cross-functional Delivery")],
          project:"project-ring",
        },
      ],
    },
    {
      id:"hust",index:"03",kind:"research",
      company:T("华中科技大学 & 巴黎文理大学", "Huazhong University of Science and Technology & PSL University"),
      shortCompany:T("华中科技大学 & 巴黎文理大学", "HUST & PSL University"),
      entity:T("联合培养 · 硕士阶段科研项目 · 新能源电力系统", "Joint master’s training · Research projects · Renewable power systems"),
      role:T("主要研究成员", "Core Research Contributor"),date:"2021.01 — 2024.01",
      overview:T("围绕新能源电力系统开展时序预测研究，探索个性化联邦学习、动态图与区间预测；参与方法设计、实验验证及英文论文写作", "Researched time-series forecasting for renewable power systems through personalized federated learning, dynamic graphs and interval prediction, contributing to method design, experiments and academic writing"),
      focus:["Federated Learning", "Dynamic Graphs", "Forecasting"],
      strategy:{
        title:T("围绕真实运行约束，连接预测与系统研究", "Connect forecasting research to operating constraints"),
        goalLabel:T("研究目标", "Research objective"), contributionLabel:T("我的贡献", "My contribution"),
        phases:[{
          id:"hust-research",number:"01",previewLabel:T("研究主线", "Research"),horizon:T("硕士科研 · 三项相互补充的研究", "Master’s research · Three complementary studies"),
          title:T("新能源电力系统的时空建模与不确定性预测研究", "Spatiotemporal modeling and uncertainty forecasting for renewable power systems"),
          goal:T("面向数据分散、场站差异和电价不确定性开展预测研究，并把具体方法放回源–荷–网的运行场景", "Address distributed data, site differences and price uncertainty, while placing forecasting methods in generation, demand and grid operations"),
          links:[
            {target:"project-hust-wind",label:T("多风电场联邦预测", "Federated wind-power forecasting"),action:T("用 SiDGI 学习特征图，通过 CPLF 共享空间参数、保留本地时间模型，在数据留在场站的条件下开展协作", "Learned feature graphs with SiDGI and collaborated through CPLF, sharing spatial parameters while retaining local temporal models and raw data")},
            {target:"project-hust-price",label:T("日前电价点预测与区间预测", "Point & interval price forecasting"),action:T("以 ARUCNN–GRU 提取时间依赖，用 Dense Skip Attention 学习特征权重，通过 MAE 与平滑分位损失支持两种预测模式", "Extracted temporal dependencies with ARUCNN–GRU, learned feature weights through Dense Skip Attention, and supported two forecast modes through MAE and smooth quantile losses")},
            {target:"project-hust-review",label:T("新能源系统 AI 方法综述", "AI for renewable power operations"),action:T("梳理源–荷–网三侧预测方法，独立完成相关章节的文献研究、英文写作与修订", "Reviewed forecasting across generation, demand and grids, independently researching, writing and revising the relevant sections")},
          ],
          result:T("3 篇相关论文 · 连接方法与应用", "Three publications · Methods & applications"),
          resultNote:T("共同第一作者 1 篇、第二作者 2 篇；发表于 2023–2025 年", "One co-first-authored and two second-authored papers, published in 2023–2025"),
        }],
      },
      background:T("新能源电力系统中的预测贯穿发电、负荷和电网运行。多风电场数据既有空间联系，也有本地差异；日前电价则同时受到时间与特征动态变化的影响，需要从点预测延伸到区间预测", "Forecasting supports generation, demand and grid operations in renewable power systems. Wind farms have spatial relationships and local differences, while day-ahead electricity prices have temporal and feature dynamics that motivate both point and interval forecasts"),
      responsibilities:T("负责问题定义、技术路线设计、算法开发与代码实现，开展实验分析，并撰写和修订英文论文；研究涵盖多场站协同建模、日前电价预测以及新能源系统 AI 应用的系统梳理", "I contributed problem formulation, methodology design, algorithm development, implementation and experimental analysis, as well as English manuscript writing and revision. The work covered cross-site forecasting, day-ahead prices and a systematic review of AI for renewable power operations"),
      stories:[
        {
          id:"hust-wind",title:T("在数据不出域的前提下，学习跨风电场联系", "Learning cross-farm relationships while keeping data local"),
          brief:T("CPLF 部分参数联邦 × SiDGI 特征图 × 本地时间建模", "CPLF partial-parameter federation × SiDGI feature graphs × Local temporal models"),
          problem:T("风电场需要利用共同的风电与气象规律，却又需要保留原始数据和本地异构时间模式。固定图结构难以充分表达特征关系，而全模型参数聚合可能削弱本地差异、增加通信负担；因此研究同时设计本地 GIN 与参数分区协作机制", "Farms benefit from shared power and meteorological patterns while needing to retain raw data and heterogeneous local temporal behavior. Fixed graphs can limit feature modeling, while full-model aggregation can weaken local differences and increase communication. The study therefore co-designs a local GIN and partitioned parameter collaboration"),
          actions:[
            T("设计 GIN 的本地模型结构：SiDGI 提取功率、风速、风向、温度与空气密度等特征之间的关系，PE / TE 注入位置与时间信息，Encoder–Decoder 建模时间依赖并输出多步预测", "Designed the local GIN structure: SiDGI extracts relationships among power, wind speed, direction, temperature and density; PE / TE supply position and time information; an Encoder–Decoder models temporal dependencies and produces multi-step forecasts"),
            T("SiDGI 用两组可学习的节点嵌入生成有向邻接矩阵，通过 top-k 筛选稀疏边，再用多头 GAT 依据输入序列校准边权。这里的图节点是特征，跨场站协作则由联邦参数聚合实现", "SiDGI forms a directed adjacency matrix from two learnable node embeddings, sparsifies edges with top-k selection, and calibrates their weights through multi-head GAT using input sequences. Graph nodes are features; cross-farm collaboration occurs through federated parameter aggregation"),
            T("在 CPLF 中，各场站用本地数据训练 GIN，仅上传加密的空间模块参数进行聚合；时间模块保留本地，最后一轮在本地微调。该分区让空间模块协作学习，同时保留各场站的本地时间规律，并缩小每轮传输的参数范围", "Within CPLF, farms train GIN on local data and aggregate encrypted spatial-module parameters. Temporal modules remain local, followed by final-round local fine-tuning. This partition shares spatial learning, preserves each farm’s temporal behavior and reduces the parameter scope transmitted each round"),
            T("参与实现、实验分析与英文论文修订。修订稿使用 NREL 2013–2014 年、5 分钟粒度的 NW 8 场站与 SE 19 场站数据，评估 30 分钟、1 小时与 2 小时预测；分别对照联邦本地模型、独立训练和 SiDGI 的三个替代配置", "Contributed implementation, experiments and English manuscript revision. The supplied revision uses NREL’s 2013–2014 five-minute data from 8 NW and 19 SE farms, testing 30-minute, 1-hour and 2-hour forecasts against local-model baselines, Standalone training and three SiDGI alternatives"),
          ],
          result:T("所给 2023 修订稿的 Table III 中，1 小时预测的 NW MAPE 从 Standalone 的 0.0571 降至 CPLF 的 0.0500，SE 从 0.0536 降至 0.0487，相对下降约 12.4% 与 9.1%。Table IV 单独检验图生成与边权校准的作用。相关研究发表于 IEEE Transactions on Network Science and Engineering（2025），我是共同第一作者；本页实验数值标注为所给修订稿版本", "In Table III of the supplied 2023 revision, 1-hour NW MAPE falls from Standalone’s 0.0571 to CPLF’s 0.0500, and SE from 0.0536 to 0.0487: relative reductions of about 12.4% and 9.1%. Table IV tests graph generation and edge calibration separately. The related work was published in IEEE TNSE (2025), with me as co-first author; experimental values here are labeled as the supplied revision") ,
          takeaway:T("协作不必共享全部模型：先区分能共同学习的特征关系与需要保留的本地时间规律，再用独立训练、参数聚合与模块消融检查收益来自哪里", "Collaboration need not share the whole model. Separate transferable feature relations from local temporal patterns, then use Standalone, aggregation and ablation comparisons to locate the gains"),
          stack:["CPLF","GIN","SiDGI","Top-k","GAT",T("个性化联邦学习","Personalized Federated Learning")],
        },
        {
          id:"hust-price",title:T("让电价预测同时表达数值与不确定性", "Forecasting electricity prices and their uncertainty"),
          brief:T("ARUCNN–GRU 时间建模 × 特征轴注意力 × 平滑分位回归", "ARUCNN–GRU temporal modeling × Feature-axis attention × Smooth quantile regression"),
          problem:T("日前电价同时存在短期变化、长期时间依赖和特征重要性的动态变化。更深的模型还需要处理退化与过拟合；点预测需要关注数值误差，区间预测则需要同时考虑宽度与区间外误差", "Day-ahead prices combine short-term changes, longer temporal dependencies and changing feature importance. Deeper models must also address degradation and overfitting. Point forecasts focus on value errors, while intervals must account for both width and errors outside the range"),
          actions:[
            T("参与构建 Drop-connected UCNN–GRU：四个 ARUCNN block 使用非共享卷积、残差映射与 PReLU，通道为 15 / 30 / 60 / 120、核大小为 3；在进入五层、每层 50 单元的 GRU 前使用 0.5 dropout，分别提取短期和长期依赖", "Contributed to Drop-connected UCNN–GRU: four ARUCNN blocks use unshared convolutions, residual mappings and PReLU, with 15 / 30 / 60 / 120 channels and kernel size 3. Dropout 0.5 precedes five GRU layers with 50 units each, combining short- and long-term feature extraction"),
            T(String.raw`Dense Skip Attention 先置换时间轴与特征轴，在特征维度上学习注意力权重；同时以另一条 GRU–Dense–PReLU 路径形成旁路，通过 \(\phi(g)+\rho(g)\) 汇合，保留特征加权与跳跃映射两种表达路径`, String.raw`Dense Skip Attention permutes time and feature axes to learn feature-wise weights. A parallel GRU–Dense–PReLU route provides a skip path; \(\phi(g)+\rho(g)\) combines weighted features with the alternate mapping`),
            T(String.raw`同一模型框架按任务选择回归损失：点预测使用 MAE；区间模式使用平滑分位损失，训练 \(\alpha=0.05\) / \(0.95\) 两种设置并展示名义 90% 区间。区间实验使用 RWS 与两组 MPL 指标评估`, String.raw`The framework selects its regression loss by task: MAE for point forecasts and smooth quantile loss for intervals, training \(\alpha=0.05\) / \(0.95\) settings and showing nominal 90% intervals. RWS and two MPL metrics evaluate interval performance`),
            T("参与代码实现、实验分析与英文稿件写作及修订。在瑞典、挪威、丹麦、芬兰 2018–2019 年小时数据上，按前 70% / 后 30% 的时间顺序划分训练与测试；结合点预测对照、区间指标、消融及参数量和训练验证时间，评估精度与资源取舍", "Contributed implementation, experiments and English manuscript writing and revision. Hourly 2018–2019 data from Sweden, Norway, Denmark and Finland is split chronologically 70% / 30% for training and testing. Point comparisons, interval metrics, ablations, parameter counts and training/validation time assess accuracy and resource trade-offs"),
          ],
          result:T("Table VIII 中，Proposed 在瑞典 / 挪威 / 丹麦 / 芬兰的点预测 MAPE 为 5.24% / 1.01% / 4.64% / 7.91%；Table X 的 RWS 为 0.125 / 0.089 / 0.111 / 0.203。论文比较了所列深度学习基线，并报告平稳与剧烈波动市场的区间表现差异。相关工作发表于 IEEE Transactions on Power Systems（2023），我是第二作者", "Table VIII reports Proposed point-forecast MAPE of 5.24% / 1.01% / 4.64% / 7.91% for Sweden / Norway / Denmark / Finland; Table X reports RWS of 0.125 / 0.089 / 0.111 / 0.203. The study compares listed deep-learning baselines and notes interval-performance differences between steadier and more volatile markets. Published in IEEE TPWRS (2023), with me as second author"),
          takeaway:T("时间依赖、特征权重和预测输出需要分别设计与验证；点预测误差、区间质量和计算资源是不同评估轴，不能用一个指标替代所有表现", "Temporal dependencies, feature weights and forecast outputs need separate design and validation. Point error, interval quality and computation are distinct evaluation axes; one metric cannot substitute for all three"),
          stack:["ARUCNN","GRU","Dense Skip Attention","PReLU",T("平滑分位回归","Smooth Quantile Regression")],
        },
        {
          id:"hust-review",title:T("以系统综述连接模型方法与电力运行场景", "Connecting AI methods with power-system operations"),
          brief:T("发电、负荷与电网三侧的方法梳理与英文写作", "Methods across generation, demand and grid operations"),
          problem:T("“双碳”背景下，新能源系统的 AI 应用分布在不同运行环节。系统综述需要把方法、预测对象和运行场景联系起来，而不只是罗列算法", "Under decarbonization goals, AI applications span several parts of renewable power-system operation. A systematic review must connect methods with forecasting targets and operational contexts"),
          actions:[
            T("系统梳理“源–荷–网”三侧预测方法及人工智能应用，独立完成相关章节的文献研究、英文写作与修订", "I systematically reviewed forecasting methods and AI applications across generation, demand and grid operations, independently conducting the literature review and writing and revising the relevant English manuscript sections"),
          ],
          result:T("相关综述发表于 Nature Reviews Electrical Engineering（2024），我是第二作者", "The review appeared in Nature Reviews Electrical Engineering in 2024, with me as second author"),
          takeaway:T("综述训练了我把具体模型放回问题背景中的能力：先说明预测对象与用途，再解释方法的适用条件和局限", "Review work trained me to place a model in context: explain the forecasting target and its use, then the method’s applicability and limitations"),
          stack:[T("文献研究","Literature Review"),T("新能源系统","Renewable Power"),T("英文科研写作","Scientific Writing")],
        },
      ],
    },
  ],
  projects: [
    {
      id:"project-agent",index:"01",category:T("业务 Agent", "Operational agent"),
      title:T("高潜商品孵化与防滑落运营 Agent", "Agent for product growth & growth-tier retention"),
      description:T("把预测工具、运营建议与跨轮次反馈组织成一个持续工作流", "A recurring workflow that connects forecasting tools, operating recommendations and cross-round feedback"),
      role:T("阿里营销算法团队 · 工具集成、工作流与记忆实现、联合决策方案设计", "Alibaba Marketing Algorithms Team · Tool integration, workflow and memory implementation, joint decision design"),
      context:T("这项工作承接短期 GMV 优化：将前一阶段优化后的价量预测模型作为 baseline，把规划周期延伸到商品的长期成长。业务区分值得孵化的高潜商品和存在成长层级滑落风险的商品，结合当前状态、预测、营销与曝光信号及历史反馈，形成有针对性的运营建议", "This work extended single-cycle GMV optimization into longer-term product growth, using the improved price–sales forecaster as its baseline. It distinguished high-potential products worth incubating from products at risk of falling to lower growth tiers, combining product state, forecasts, marketing and exposure signals, and past feedback to inform interventions"),
      challenge:T("一次评估无法覆盖持续变化的商品状态；价格与广告预算又会共同影响业务结果。方案既要复用现有模型，也要明确模型组合的假设、预算与 ROI 约束，并能够处理执行失败和人工复核", "Product state changes across rounds, and both price and advertising budget affect outcomes. The solution needed to reuse existing models, make their combination assumptions explicit under budget and ROI constraints, and support execution failures and human review"),
      flow:[T("商品与信号","Products & signals"),T("预测工具与评估","Forecast & assess"),T("运营建议与审核","Recommend & review"),T("执行反馈与记忆","Feedback & memory")],
      decisions:[
        {
          title:T("把预测能力封装为工具", "Make forecasting callable"),
          body:T("复用短期阶段优化后的价量预测模型，并封装为可调用工具。商品评估综合营销促销、广告投放、搜索曝光与销量预测，形成成长潜力和维持风险的判断依据", "I reused the improved price–sales forecaster from the short-term phase and exposed it as a callable tool. Product assessment combined marketing, advertising and search exposure with sales forecasts to inform growth-potential and retention-risk judgments"),
        },
        {
          title:T("让历史反馈进入下一轮决策", "Carry feedback into the next round"),
          body:T("实现各轮运营结果的存储与检索，把历史反馈和当前商品状态共同用于目标判断及建议生成。重试与回退处理工作流失败，人工审核参与运营建议的审查", "I stored and retrieved round-level outcomes, using historical feedback alongside the current state to inform objectives and recommendations. Retries and fallbacks handled workflow failures, while human review supported recommendation checks"),
        },
        {
          title:T("明确联合模型的假设与验证范围", "Make joint-model assumptions explicit"),
          body:T("通过基线归一化对齐价格–销量与预算–GMV 模型，构建共享预算及 ROI 约束下的 GMV(B,P)。设计中明确适用范围、重新标定要求与回退至端到端建模的条件；使用价格、预算同时变化样本的结构验证仍是规划", "I designed baseline normalization between price–sales and budget–GMV models and a GMV(B,P) formulation under shared-budget and ROI constraints. The design specified applicability, recalibration requirements and end-to-end fallback criteria. Validation on historical samples with simultaneous price and budget changes remained planned"),
        },
      ],
      table:{
        headers:[T("线上实验","Online phase"),T("建议采纳率","Adoption"),T("GMV 增幅比较","GMV growth comparison")],
        rows:[
          [T("第一期","Phase 1"),"26.6%",T("较该期对照组高 65.2%","65.2% higher than that phase’s control")],
          [T("第二期","Phase 2"),"39.3%",T("较该期对照组高 27.7%","27.7% higher than that phase’s control")],
        ],
        note:T("两期数字为各自对照组下的项目整体效果，不合并，也不单独归因于 Agent 的某个模块", "Each phase reports overall project results against its own control. The phases are not combined or attributed to a single agent component"),
      },
      outcome:T("完成商品评估、运营决策、执行反馈与记忆更新的流程串联，并结合人工审核支持建议使用。项目通过两期线上 A/B 实验观察建议采纳与业务效果", "The implementation connected product assessment, operating decisions, execution feedback and memory updates, with human review supporting recommendations. Two online A/B phases evaluated adoption and business outcomes at project level"),
      learning:T("我在这里的思考是：Agent 的工程价值需要体现在业务流程中。预测依据、历史反馈、失败处理和审核环节必须各自清晰，联合模型也需要在真实样本上验证结构假设", "My takeaway is that an agent’s engineering value must show up in the operating workflow. Forecasting evidence, historical feedback, failure handling and review each need a clear role; joint models also need real-sample validation of their structural assumptions"),
      tags:["Tool Calling","Workflow","Memory","Human Review","GMV(B,P)"],
      visualStory:"ali-agent",related:"ali-long-term",
    },
    {
      id:"project-wiki",index:"02",category:T("个人项目 · 知识工程", "Independent project · Knowledge engineering"),
      title:T("AITradingWiki", "AITradingWiki"),
      description:T("一个保留证据来源、不确定性与审批边界的投研知识工作流", "An investment-research workflow that preserves provenance, uncertainty and approval boundaries"),
      role:T("独立开发者 · 需求定义、工作流开发与验证机制", "Independent developer · Requirements, workflow development and verification"),
      context:T("投资研究资料分散在文档、视频和已有研究页面中。真正可复用的研究上下文，需要保留观点来自哪里、对应哪一段材料、证据状态是什么，以及更新经过了哪些审核。项目以 Codex 辅助的知识系统组织这些环节，并结合投资研究经理反馈迭代", "Investment research spans documents, videos and existing research pages. Reusable context needs to preserve where a claim came from, its source location, evidence status and the review history of an update. I organized these steps in a Codex-assisted knowledge system, refined through investment research managers’ feedback"),
      challenge:T("大量资料不能一次性全部放入上下文；可读文本也不足以替代证据定位。研究页面更新还需要保证只写入获批范围，并在写入后核对页面、索引与日志是否一致", "Large collections cannot all fit into context, and readable text alone does not provide source provenance. Page updates must stay within approved scope, then be checked against the pages, index and logs after writing"),
      flow:[T("文档 / 视频","Documents / video"),T("证据与来源定位","Evidence & provenance"),T("受限检索与审批","Retrieve & approve"),T("独立验证与回执","Verify & receipt")],
      decisions:[
        {
          title:T("先筛选，再按需读取", "Select first, retrieve precisely"),
          body:T("以元数据和页面链接筛选候选资料，再在限定上下文预算内读取目标章节。这样让上下文由当前研究问题决定，并保留源定位信息、内容哈希与证据状态标签", "I selected candidates through metadata and page links, then retrieved targeted sections within bounded context budgets. Context stayed tied to the research question while retaining source locators, content hashes and evidence-status labels"),
        },
        {
          title:T("把证据属性保留在研究链中", "Keep evidence attributes in the workflow"),
          body:T("文档与视频入库、证据分类、来源追溯和研究页面关联被组织在同一工作流中。检索结果继续保留不确定性，避免在上下文传递时丢失原材料的证据状态", "The workflow integrated document and video ingestion, evidence classification, provenance and linked research pages. Retrieved context retained uncertainty and evidence status as it moved through the research process"),
        },
        {
          title:T("审批与完成验证分成两个环节", "Separate approval from completion checks"),
          body:T("知识库更新采用页面级人工审批。写入后进行独立验证，检查来源完整性、获批范围、页面和索引一致性、仅追加日志，并在生成验证回执后才把更新标记为完成", "Page-level human approval governed updates. Independent post-write checks examined source integrity, approved scope, page/index consistency and append-only logs. An update was treated as complete only after a verification receipt was produced"),
        },
      ],
      outcome:T("独立实现了集成入库、受限检索、证据追溯、页面审批和独立写后验证的研究工作流。成果体现为可追溯上下文与明确的更新完成条件，并通过投资研究经理反馈持续完善需求", "I independently implemented a workflow integrating ingestion, bounded retrieval, provenance, page approval and independent post-write checks. The engineering outcome is traceable context and explicit completion criteria for updates, with requirements refined through research-manager feedback"),
      learning:T("知识系统的可信度依赖于证据在每个环节是否被保留。对我而言，来源定位、审批范围和验证回执是研究流程的一部分，也决定了内容是否可以被后续研究可靠复用", "A knowledge system’s credibility depends on preserving evidence throughout the workflow. Source locations, approval scope and verification receipts are part of the research process and determine how reliably the material can be reused"),
      tags:["Codex",T("来源追溯","Provenance"),T("受限检索","Bounded Retrieval"),T("页面审批","Page Approval"),T("独立验证","Independent Verification")],
    },
    {
      id:"project-qwen",index:"03",category:T("大模型 × 时序预测", "LLMs × Time-series forecasting"),
      title:T("Qwen3 增强的销量预测与推理优化", "Qwen3-enhanced forecasting & inference"),
      description:T("从条件表征到后训练，再分别评估预测精度与推理稳定性", "From conditional representations to post-training, with separate accuracy and stability evaluation"),
      role:T("阿里营销算法团队 · 表征融合、后训练实验、下游预测与推理优化", "Alibaba Marketing Algorithms Team · Representation fusion, post-training, downstream forecasting and inference"),
      context:T("这条优化路线服务于短期价量预测：在未来一个营销周期（如 14 天）内，预估不同价格下的销量，为 GMV 优化提供依据。围绕历史数值、商品与营销条件，将 Qwen3 表征与时序模型结合，验证后训练对下游预测的收益，并单独优化线上输出稳定性", "This optimization track supported short-term price–sales forecasting: estimating sales at different prices over a future marketing cycle, such as 14 days, to inform GMV optimization. It combined Qwen3 representations of product and marketing context with temporal signals, evaluated post-training in downstream forecasting, and separately improved inference stability"),
      challenge:T("通用大模型表征未必与销量变化任务充分对齐。即使标签任务得到改善，也需要重新接入下游模型验证实际预测误差；线上稳定性则需要在逐样本、跨批次和受控扰动条件下单独衡量", "General-purpose representations may not be sufficiently aligned with sales-change prediction. Improvements on the label task must be tested again after integration with the downstream forecaster. Stability needs separate per-sample, cross-batch and controlled-perturbation measurements"),
      flow:[T("商品与营销条件","Product & marketing context"),T("Qwen3 条件表征","Qwen3 representation"),T("门控时序融合","Gated temporal fusion"),T("重训下游预测器","Retrain forecaster")],
      decisions:[
        {
          title:T("以冻结表征建立可比较起点", "Establish a frozen-representation baseline"),
          body:T("使用冻结的 Qwen3-4B 编码商品信息、营销条件、价格与历史销量，经门控融合接入时序表征。冻结的是参数，输出表征仍随输入条件变化。使用同配置、未引入 Qwen3 的模型作为比较基线", "I encoded product information, marketing conditions, prices and historical sales with frozen Qwen3-4B, then used gated fusion with temporal representations. Parameters were frozen, while the representation remained input-dependent. Comparison used an otherwise identically configured model without Qwen3"),
        },
        {
          title:T("让后训练围绕可验证任务展开", "Align post-training with a verifiable task"),
          body:T("先用六类销量变化标签进行 LoRA SFT，再从同一 SFT 基线比较 RLVR（GRPO）与 OPD。RLVR 奖励对应标签正确性；OPD 以同任务适配教师的概率指导学生采样输出。每个方案都接入表征并重新训练下游预测器", "I first applied LoRA SFT on six sales-change labels, then compared RLVR with GRPO and OPD from the same SFT baseline. RLVR rewarded label correctness; OPD used a task-adapted teacher’s probabilities for student-sampled outputs. Each representation was integrated with a retrained downstream forecaster"),
        },
        {
          title:T("单独解决输出稳定性问题", "Evaluate stability on its own terms"),
          body:T("引入 Monte Carlo Dropout 的多次采样与均值聚合。跨批次一致性使用逐样本预测 CV 衡量，相近输入的敏感性使用受控扰动下的预测相对变化衡量，两项都与原线上推理方案比较", "I introduced repeated Monte Carlo Dropout sampling and mean aggregation. Per-sample cross-batch CV measured consistency; relative prediction changes under controlled perturbations measured sensitivity. Both were compared with the original production inference method"),
        },
      ],
      table:{
        headers:[T("方案 / 指标","Approach / measure"),T("比较基线","Baseline"),T("相对改善","Relative improvement")],
        rows:[
          [T("冻结 Qwen3 表征 · wMAPE","Frozen Qwen3 · wMAPE"),T("同配置，无 Qwen3 表征","Same configuration, without Qwen3"),"↓ 2.1%"],
          [T("LoRA SFT · wMAPE","LoRA SFT · wMAPE"),T("冻结表征方案","Frozen representations"),T("整体 ↓ 3.7% · 大促跃升 ↓ 6.2%","Overall ↓ 3.7% · Promotion jumps ↓ 6.2%")],
          ["RLVR / OPD · wMAPE",T("同一 SFT 基线","Same SFT baseline"),"↓ 2.9% / ↓ 3.1%"],
          [T("跨批次预测 CV","Cross-batch prediction CV"),T("原线上推理方案","Original production inference"),"↓ 11%"],
          [T("受控扰动后的预测相对变化","Relative change under perturbations"),T("原线上推理方案","Original production inference"),"↓ 10%"],
        ],
        note:T("各行使用各自基线；后训练改善幅度不串联相加。CV 和输入扰动指标属于稳定性指标", "Each row uses its stated baseline; post-training gains are not added together. CV and perturbation measures quantify stability"),
      },
      metrics:[
        {value:"+5.06%",label:T("GMV","GMV")},
        {value:"+5.50%",label:T("子订单数","Sub-order count")},
        {value:"+4.51%",label:T("GMV 覆盖率","GMV coverage")},
      ],
      outcome:T("上表给出不同模型及推理方案的离线结果。项目整体线上 A/B 结果则是多轮迭代相较初始版本的累计改善，支撑促销定价与补贴资源配置；不能据此单独归因到某一次后训练实验", "The table reports offline model and inference results. The overall online A/B figures are cumulative improvements across project iterations versus the initial version, supporting promotional pricing and subsidy allocation. They do not isolate the effect of one post-training experiment"),
      learning:T("从大模型标签任务到业务预测，中间仍有完整的下游验证链。这个项目让我同时关注任务对齐、表征接入方式、评估基线和线上使用时的输出质量", "There is a full downstream validation chain between an LLM label task and business forecasting. This project brings task alignment, representation integration, evaluation baselines and output quality in use into the same engineering picture"),
      tags:["Qwen3-4B","LoRA SFT","GRPO","OPD","Gated Fusion","Monte Carlo Dropout"],
      visualStory:"ali-forecast",related:"ali-short-term",
    },
    {
      id:"project-ring",index:"04",category:T("产品实践 · 智能硬件", "Product development · Smart hardware"),
      title:T("智能戒指：从用户需求到首代样机", "Smart ring: from user needs to a first prototype"),
      description:T("把市场调研、需求优先级、工程可行性与原型反馈串起来", "Connecting discovery, priorities, engineering feasibility and prototype feedback"),
      role:T("初创团队产品经理 · 深圳科创学院 · 2024.01 — 2024.06", "Startup product manager · Shenzhen InnoX Academy · 2024.01 — 2024.06"),
      context:T("项目从智能戒指概念出发，围绕健康监测开展产品定义。我的任务是推动首代方案成形：识别用户需求，制定功能优先级，并与软硬件工程师共同评估实现路径", "The project began with a smart-ring concept focused on health monitoring. I worked to shape a first-generation product: identify user needs, prioritize features and assess implementation paths with software and hardware engineers"),
      challenge:T("首代产品的范围需要在用户需求与技术可行性之间形成清晰选择。样机测试还需要真实用户参与，并将反馈转为下一轮迭代输入，避免调研、开发与运营彼此脱节", "First-generation scope requires clear choices across user needs and technical feasibility. Prototype testing needs real users and a path for feedback to enter the next iteration, connecting discovery, development and operations"),
      flow:[T("市场调研 / 访谈","Research / interviews"),T("需求与功能优先级","Requirements / priorities"),T("可行性与首代样机","Feasibility / prototype"),T("用户测试与迭代","User testing / iteration")],
      decisions:[
        {
          title:T("先定义需求，再明确首代范围", "Use discovery to shape first-generation scope"),
          body:T("基于市场调研与 200+ 用户访谈整理健康监测需求，明确优先级，并完成核心功能规划与原型设计。把用户表达转成可以与工程团队共同讨论的产品方案", "Market research and 200+ user interviews informed health-monitoring requirements and priorities. I produced core feature plans and prototypes, translating user input into a product proposal for engineering discussion"),
        },
        {
          title:T("让技术可行性进入产品定义", "Include feasibility in product definition"),
          body:T("与软硬件工程师协作开展技术可行性评估，推进首代样机开发。需求、原型和实现路径共同构成开发讨论的输入", "I worked with software and hardware engineers on technical feasibility assessments and first-prototype development. Requirements, prototypes and implementation paths informed the development discussion together"),
        },
        {
          title:T("建立能持续收集反馈的用户渠道", "Create a continuing channel for feedback"),
          body:T("建立 200+ 天使用户社群，组织原型测试和反馈收集，并协调内部研发与外部运营资源，推进敏捷迭代与核心里程碑", "I built a community of 200+ early adopters, organized testing and feedback, and coordinated internal development and external operations for agile iteration and core milestones"),
        },
      ],
      metrics:[
        {value:"200+",label:T("用户访谈","User interviews")},
        {value:"200+",label:T("天使用户社群","Early-adopter community")},
        {value:T("6 个月","6 months"),label:T("核心里程碑交付周期","Core milestone delivery")},
      ],
      outcome:T("主导从概念到首代样机的产品开发，团队在半年内完成核心里程碑，项目获得孵化器种子轮投资。访谈、社群、样机与融资分别对应需求探索、反馈渠道、开发阶段和团队项目成果", "I led product development from concept to the first prototype. The team completed core milestones within six months and the project secured incubator seed investment. Interviews, the community, the prototype and funding reflect discovery, feedback infrastructure, the development stage and team-level outcomes respectively"),
      learning:T("这个经历补充了我在算法之外的产品视角：问题要由用户场景解释，范围要能与工程讨论，交付之后还要留出反馈进入下一轮的通道", "This experience added a product perspective to my technical work: explain a problem through user context, define a scope engineers can discuss, and keep a channel for feedback to shape the next iteration"),
      tags:[T("用户研究","User Research"),T("产品定义","Product Definition"),T("原型","Prototyping"),T("软硬件协作","Hardware / Software"),T("敏捷迭代","Agile Iteration")],
      visualStories:["innox-definition","innox-delivery"],
      views:{
        "innox-definition":{title:T("智能戒指 · 需求定义与首代方案", "Smart ring · Discovery & first-generation scope"),description:T("从 200+ 用户访谈出发，连接功能优先级、原型规划与工程可行性", "Connect 200+ user interviews to feature priorities, prototypes and engineering feasibility"),decisionTitles:[T("需求与功能规划", "Requirements and feature planning"),T("可行性与研发协作", "Feasibility and engineering collaboration")]},
        "innox-delivery":{title:T("智能戒指 · 用户反馈与交付迭代", "Smart ring · User feedback & delivery"),description:T("以天使用户测试为反馈入口，协调研发与运营推进核心里程碑", "Use early-adopter testing to inform iteration and align engineering and operations around core milestones"),decisionTitles:[T("天使用户与原型测试", "Early adopters and prototype testing"),T("跨团队资源协同", "Cross-functional coordination")]},
      },
      related:"innox-discovery",
    },
  ],
  // Research includes complete studies and narratives derived from the original experience stories.
  researchProjects:[
    {
      id:"project-deformer",index:"R1",category:T("机制研究 · 已投稿", "Mechanism research · Submitted"),
      title:T("DEFormer：缓解时序 Transformer 秩坍缩", "DEFormer: mitigating Transformer rank collapse"),
      description:T("从浅层秩坍缩诊断，到去相关 Tokenization 与去自回归多任务训练", "From shallow-layer rank diagnostics to decorrelative tokenization and de-autoregressive multi-task training"),
      role:T("研究主导 · 阿里营销算法团队 · 2025.07 — 2026.07", "Research lead · Alibaba Marketing Algorithms Team · 2025.07 — 2026.07"),
      context:T("面向电商促销定价的销量预测，论文使用 Small（约 4,500 件商品）与 Large（约 9,000 件商品）两个真实零售数据集。每个数据集覆盖三年、按天记录，预测窗固定为未来 14 天；输入包含历史销量、价格、点击 UV、预先确定的未来价格，以及序列化的商品、类目与品牌标识", "For sales forecasting that supports retail promotional pricing, the paper evaluates Small (~4,500 products) and Large (~9,000 products). Each contains three years of daily data with a fixed 14-day forecast horizon. Features include historical sales, prices, click UV, predetermined future prices, and serialized product, group and brand identifiers"),
      challenge:T("销量序列的强自相关与严格自回归任务形态，可能使注意力模式与 token 表征趋同。论文对 point-wise Transformer 与 PatchTST 的初始化和训练后状态进行分层诊断，说明浅层同样值得检查；改进还需同时接受预测误差、覆盖率与模块消融的验证", "Strong input autocorrelation and a strictly autoregressive task can encourage similar attention patterns and token representations. Layer-wise analysis compares point-wise Transformer and PatchTST at initialization and after training, showing why shallow layers also need diagnosis. Changes are then evaluated through forecast error, coverage and module ablations"),
      flow:[T("自相关与层深分析","Autocorrelation & depth"),T("稳定秩 / token 相似度","Rank / token similarity"),T("去相关与多任务","Decorrelation & multitask"),T("消融与零售评估","Ablations & retail evaluation")],
      decisions:[
        {
          title:T("使用可观测表征指标进行诊断", "Diagnose with observable representation measures"),
          body:T(String.raw`使用注意力矩阵的稳定秩 \(\rho_{\mathrm{sr}}\) 与 token 平均余弦相似度 \(\rho_{\mathrm{ca}}\)，比较三层网络在初始化、训练后高 ACF 和低 ACF 条件下的表现。高 / 低 ACF 以预测窗内平均 ACF 的 0.5 阈值划分；论文观察到训练可以缓解初始化坍缩，但高 ACF 输入仍更容易出现低稳定秩和高 token 相似度`, String.raw`I used attention stable rank \(\rho_{\mathrm{sr}}\) and mean token cosine similarity \(\rho_{\mathrm{ca}}\) across three layers, comparing initialization with trained high- and low-ACF conditions. The split uses a mean ACF threshold of 0.5 over the forecast horizon. Training can escape initialization collapse, while high-ACF inputs still tend toward lower rank and more similar tokens`),
        },
        {
          title:T("输入端：原序列与差分的双路 Tokenization", "Input: dual-path tokenization of raw values and differences"),
          body:T(String.raw`保留原始序列 \(X\)，同时构造一阶差分 \(\Delta X\)；对两路输入进行缩放与带符号的对数变换 \(\phi\)，再通过独立的线性投影 \(W\) 和 \(W_d\) 相加，得到 \(Z = \phi(X)W + \phi(\Delta X)W_d\)。原序列保留水平信息，差分支路减轻自相关依赖`, String.raw`Keep the raw sequence \(X\) and compute first differences \(\Delta X\). Apply scaling and the signed-log transform \(\phi\) to both paths, then combine independent projections \(W\) and \(W_d\): \(Z = \phi(X)W + \phi(\Delta X)W_d\). Raw values retain level information while the differenced path reduces autocorrelation dependence`),
        },
        {
          title:T("目标与训练端：log-return、MMoE 与双任务监督", "Targets and training: log-return, MMoE and dual-task supervision"),
          body:T(String.raw`以最后一个历史值 \(X_L\) 为参照，把回归目标变换为 \(\ln(1+Y/X_L)\)。Transformer 后接 MMoE，分别输出连续预测和辅助分类结果；回归分支使用 MSE，分类分支使用 Focal Loss，以 \(\mathcal{L}=\mathcal{L}_{\mathrm{reg}}+\beta\mathcal{L}_{\mathrm{cla}}\) 共同训练`, String.raw`Transform the regression target to \(\ln(1+Y/X_L)\), relative to the final historical value \(X_L\). MMoE follows the Transformer and feeds continuous regression and auxiliary classification heads. MSE and Focal Loss are combined as \(\mathcal{L}=\mathcal{L}_{\mathrm{reg}}+\beta\mathcal{L}_{\mathrm{cla}}\)`),
        },
        {
          title:T("验证：完整基线对照、逐模块消融与跨层分布", "Validation: full baselines, module ablations and layer-wise distributions"),
          body:T("Table 2 比较 PatchTST、Transformer、iTransformer、HDMixer、DLinear 与 Naive；Table 1 分别移除 De-corr、De-auto 和两者。除了 MAPE、wMAPE、SC、WSC，还用图 5–7 检查稳定秩、token 相似度及高 / 低 ACF 之间的 KS 距离，使预测改进与表征变化形成对应证据", "Table 2 compares PatchTST, Transformer, iTransformer, HDMixer, DLinear and Naive. Table 1 removes De-corr, De-auto and both. Alongside MAPE, wMAPE, SC and WSC, Figures 5–7 examine stable rank, token similarity and KS distances between ACF conditions, connecting prediction gains with representation evidence"),
        },
      ],
      paperStudy:deformerStudy,
      outcome:T("在论文的两个零售数据集上，DEFormer 在四项指标中均优于所列对照。相较 PatchTST，Small / Large 的 wMAPE 相对下降 12.7% / 5.6%，WSC 提升 3.5 / 1.2 个百分点；这是离线预测与覆盖评估，不对应项目整体 GMV 的单模块归因。论文保持已投稿状态", "On both retail datasets in the paper, DEFormer leads the listed comparators on all four metrics. Relative to PatchTST, Small / Large wMAPE falls by 12.7% / 5.6%, and WSC rises by 3.5 / 1.2 percentage points. These are offline forecasting and coverage results, with no isolated attribution to overall project GMV. The manuscript remains submitted"),
      learning:T("方法设计与证据需要一起组织：输入端降低依赖、目标与监督端改变任务形态，再通过基线对照、模块消融和表征分布检查它们是否形成一致的改善。结论的适用范围是论文中的两个零售数据集与 14 天预测任务", "Method design and evidence belong together: reduce input dependence, change targets and supervision, then check whether baselines, ablations and representation distributions tell a consistent story. The reported findings apply to the paper’s two retail datasets and 14-day forecasting task"),
      tags:["PatchTST","Decorrelation","MMoE","Log-return","Focal Loss","Stable Rank"],
      visualStory:"ali-deformer",related:"ali-short-term",
    },
    {
      id:"project-hust-wind",index:"R2",sourceStory:"hust-wind",
      category:T("研究详解 · 联邦学习与动态图", "Research · Federated learning & dynamic graphs"),
      title:T("FedGIN / CPLF：个性化联邦与可学习特征图", "FedGIN / CPLF: personalized federation and learned feature graphs"),
      role:T("主要研究成员 · 方法设计、实现与实验分析 · 共同第一作者", "Core research contributor · Method design, implementation and analysis · Co-first author"),
      context:T("多风电场预测需要协同学习，又受原始数据本地保存与各场站时间模式异构的约束。GIN 在本地学习特征图和时间表征，CPLF 只聚合空间模块参数；所给修订稿用加州 NW 8 场站、SE 19 场站的 NREL 数据开展 30 分钟至 2 小时预测实验", "Multi-farm forecasts need collaboration under raw-data locality and heterogeneous temporal behavior. GIN learns feature graphs and temporal representations locally; CPLF aggregates spatial-module parameters. The supplied revision evaluates 30-minute to 2-hour forecasts using NREL data from 8 NW and 19 SE California farms"),
      researchStudy:windResearchStudy,
      decisionTitles:[T("本地 GIN：图表征与时间建模", "Local GIN: graph and temporal representations"),T("SiDGI：生成有向结构并校准边权", "SiDGI: directed graph generation and edge calibration"),T("CPLF：空间共享、时间个性化", "CPLF: shared spatial modules and temporal personalization"),T("分开检验协作与图模块的收益", "Test collaboration and graph components separately")],
    },
    {
      id:"project-hust-price",index:"R3",sourceStory:"hust-price",
      category:T("研究详解 · 点预测与区间预测", "Research · Point & interval forecasting"),
      title:T("Dense Skip Attention：日前电价点预测与区间预测", "Dense Skip Attention: point and interval day-ahead prices"),
      role:T("主要研究成员 · 方法设计、代码实现与实验分析 · 第二作者", "Core research contributor · Method design, implementation and analysis · Second author"),
      context:T("面向日前市场中的报价、购售电与风险评估需求，研究使用瑞典、挪威、丹麦、芬兰 2018–2019 年小时数据。输入涵盖价格、功率交换、发电与用电、容量，以及丹麦、芬兰的风电特征；时间建模与特征加权共同服务于点预测和区间预测", "For day-ahead market bidding, energy purchases/sales and risk assessment, the study uses hourly 2018–2019 data from Sweden, Norway, Denmark and Finland. Inputs cover prices, power exchanges, generation and consumption, capacity, and wind features in Denmark and Finland. Temporal modeling and feature weighting support point and interval forecasts"),
      researchStudy:priceResearchStudy,
      decisionTitles:[T("ARUCNN–GRU：时间建模与正则化", "ARUCNN–GRU: temporal modeling and regularization"),T("Dense Skip Attention：特征轴加权与旁路", "Dense Skip Attention: feature-axis weighting and skip path"),T("按输出任务选择损失与评估指标", "Select losses and metrics for the output task"),T("验证精度、区间质量与计算取舍", "Validate accuracy, interval quality and computation")],
    },
    {
      id:"project-hust-review",index:"R4",sourceStory:"hust-review",
      category:T("研究详解 · 新能源系统综述", "Research · Renewable power review"),
      title:T("新能源电力系统：AI 方法与运行场景", "Renewable power systems: AI methods & operations"),
      role:T("相关章节文献研究、英文写作与修订 · 第二作者", "Literature research, writing and revision of the relevant sections · Second author"),
      context:T("新能源电力系统的 AI 应用分布在发电、负荷和电网运行的不同环节。综述以运行场景为线索，将预测对象、方法选择与应用用途联系起来", "AI applications in renewable power span generation, demand and grid operation. The review connected forecasting targets, methods and uses through their operating contexts"),
      decisionTitles:[T("按源–荷–网组织方法与问题", "Organize methods around generation, demand and grids")],
    },
  ],
  skills:[
    {title:T("编程与框架","Programming & frameworks"),items:["Python","SQL","PyTorch","TensorFlow"]},
    {title:T("大模型与后训练","LLMs & post-training"),items:["Qwen3","Transformers","LoRA SFT","RLVR / GRPO","On-Policy Distillation"]},
    {title:T("Agent 与知识工作流","Agents & knowledge workflows"),items:["Tool Calling","Workflow Integration","Memory Storage",T("重试与回退","Retry & Fallback"),T("人工审核","Human Review"),T("证据追溯","Evidence Provenance")]},
    {title:T("研究与产品方法","Research & product methods"),items:[T("时序预测","Time-series Forecasting"),T("联邦学习","Federated Learning"),T("动态图","Dynamic Graphs"),T("实验与消融","Experiments & Ablations"),"A/B Testing",T("用户研究","User Research")]},
  ],
  education:[
    {id:"psl",name:T("巴黎文理研究大学","Université Paris Sciences & Lettres"),degree:T("人工智能 · 硕士，第二学位","Artificial Intelligence · Master’s degree, second degree"),date:"2021.09 — 2024.07"},
    {id:"hust",name:T("华中科技大学","Huazhong University of Science and Technology"),degree:T("新能源科学与工程 · 硕士","New Energy Science and Engineering · Master’s degree"),date:"2021.09 — 2024.07",note:T("国家奖学金 · Top 1%","National Scholarship · Top 1%")},
    {id:"wut",name:T("武汉理工大学","Wuhan University of Technology"),degree:T("通信工程（卓越计划）· 本科","Communication Engineering, Excellence Program · Bachelor’s degree"),date:"2017.09 — 2021.07"},
  ],
  papers:[
    {title:"DEFormer: Understanding and Alleviating Rank Collapse Caused by Autocorrelation in Transformer-based Time Series Forecaster",venue:T("2026 · 已投稿 · Ding, Y., et al.","2026 · Submitted · Ding, Y., et al.")},
    {title:"Privacy-Preserving Graph Inference Network for Multi-Entity Wind Power Forecast: A Federated Learning Approach",venue:T("IEEE Transactions on Network Science and Engineering · 2025 · 共同第一作者","IEEE Transactions on Network Science and Engineering · 2025 · Co-first author")},
    {title:"Artificial intelligence-based methods for renewable power system operation",venue:T("Nature Reviews Electrical Engineering · 2024 · 第二作者","Nature Reviews Electrical Engineering · 2024 · Second author")},
    {title:"Dense Skip Attention Based Deep Learning for Day-Ahead Electricity Price Forecasting",venue:T("IEEE Transactions on Power Systems · 2023 · 第二作者","IEEE Transactions on Power Systems · 2023 · Second author")},
  ],
  honors:T("国家一等奖 2 项、国家三等奖 2 项（2019—2023，最高前 0.9%）· 国家奖学金（2024）", "Two national first prizes and two national third prizes (2019–2023, highest placement top 0.9%) · National Scholarship (2024)"),
  language:T("英语 · IELTS 7.5 / 9", "English · IELTS 7.5 / 9"),
};
