/* Bilingual content. Measured claims are grounded in the supplied v4 CVs.
   DEFormer and research details use the owner-supplied manuscripts.
   The Alibaba two-stage narrative incorporates Jason's October 12 clarification.
   The 14-day horizon is an example; no new measured results are inferred. */
const T = (zh, en) => ({ zh, en });
// Figures and exact Table 1 / Table 2 values from the supplied AAAI manuscript.
const deformerStudy = {
  narrative: {
    sections:[
      {key:"context",title:T("背景", "Background"),heading:T("为促销定价提供未来 14 天的销量预测", "Forecast the next 14 days to support promotional pricing")},
      {key:"challenge",title:T("挑战", "Challenge"),heading:T("不同位置的注意力，为什么会趋向同一种模式？", "Why can attention at different positions converge on the same pattern?")},
      {key:"approach",title:T("方案与贡献", "Solution & contributions"),nav:T("方案与贡献", "Solution"),heading:T("从机制诊断出发，分别改进输入与训练任务", "Use the diagnosis to redesign inputs and the training task")},
      {key:"results",title:T("结果", "Results"),heading:T("预测效果、模块作用与表征变化是否一致？", "Do forecasting, ablations and representations tell a consistent story?")}
    ],
    background:T("销量预测为促销定价提供需求估计。这个项目以 PatchTST 为基线，既关注预测误差，也关注有多少商品达到可用的误差标准：平均效果提升，还需要落实到足够多的商品上", "Sales forecasts provide demand estimates for promotional pricing. Starting from PatchTST, this project examines both forecast error and how many products meet an acceptable error threshold: better aggregate accuracy should also reach enough products"),
    intuition:T("注意力矩阵的每一行对应一个 Query 对各个 Key 的关注权重。如果不同的行越来越相似，不同位置就倾向于读取相同的信息，注意力模式的有效多样性下降。这是理解 attention rank collapse 的直观入口；Token 表征是否也趋同，需要另外检查", "Each row of an attention matrix records a query’s weights over keys. When rows become similar, different positions tend to read the same information, reducing the effective diversity of attention patterns. This provides an intuition for attention rank collapse; token homogenization needs a separate check"),
    phenomenon:{src:"assets/deformer/attention-collapse-example.png",width:1408,height:910,
      title:T("现象图解：相似的关注模式与更有差异的关注模式", "Visual intuition: similar versus more distinct attention patterns"),
      guide:T("纵轴是 Query，横轴是 Key。沿不同的行观察亮点是否总落在相近的列；两幅图的色标范围不同，应比较模式而非亮度", "Queries are on the vertical axis and keys on the horizontal axis. Compare whether different rows repeatedly attend to the same columns. The color scales differ, so compare patterns rather than brightness"),
      panels:[
        {viewBox:"22 523 346 324",label:T("(e) · w/o Prediction-Feedback", "(e) · w/o Prediction-Feedback"),note:T("纵向条纹明显：多个 Query 倾向关注相同的 Key，表现出模式趋同", "Vertical stripes: multiple queries tend to attend to the same keys, illustrating similar patterns")},
        {viewBox:"725 523 349 324",label:T("(g) · w/ Prediction-Feedback", "(g) · w/ Prediction-Feedback"),note:T("关注位置随 Query 变化，对照展示更有区分性的注意力模式", "Attention locations vary across queries, illustrating more distinct patterns")}
      ],
      note:T("其他任务中的 Self-Attention 示例，选取所提供原图的 (e)/(g) 面板。Prediction-Feedback 是原图的方法标签；此图用于现象说明，DEFormer 的实验诊断见下方图 1。热力图本身不能判定矩阵的秩", "Self-attention examples from another task, showing panels (e)/(g) of the supplied image. Prediction-Feedback is the original method label. This illustrates the phenomenon; DEFormer’s diagnostic evidence follows in Figure 1. A heatmap alone does not establish matrix rank")},
    measures:T("为把视觉直觉变成可比较的证据，我检查两个指标：注意力稳定秩衡量注意力矩阵的有效多样性，Token 平均余弦相似度衡量表征是否趋同。稳定秩低、相似度高，是需要进一步诊断的信号", "To turn visual intuition into comparable evidence, I examine two measures: attention stable rank captures effective matrix diversity, while mean token cosine similarity checks representation homogenization. Low stable rank and high similarity are signals for further diagnosis"),
    contribution:T("我的贡献：以稳定秩与 Token 相似度开展分层诊断，提出原序列与差分的双路 Tokenization，以及目标变换与多任务训练，并用基线对照、逐模块消融和表征分析检验改进", "My contribution: layer-wise diagnosis using stable rank and token similarity; dual-path tokenization of raw values and differences; transformed targets and multi-task training; and evaluation through baselines, component ablations and representation analysis"),
    bridge:T("针对输入中的强自相关，在输入端增加差分支路；针对单一连续回归的监督形态，在目标与训练端引入变换和辅助分类。两项设计分别作用于模型读入的信息与模型学习的目标", "Add a differenced path to address strong autocorrelation in the inputs; introduce transformed targets and auxiliary classification to change continuous-regression-only supervision. The two designs act on what the model reads and what it learns to predict"),
    equations:T("展开公式与符号说明", "Expand equations and notation"),
    resultHeadings:[T("预测效果：相较 PatchTST 是否改善？", "Forecasting: does it improve on PatchTST?"),T("模块消融：两个设计是否都有作用？", "Ablations: do both designs contribute?"),T("表征验证：是否呼应最初的诊断？", "Representations: do they support the original diagnosis?")],
    ablation:T("分别移除 De-corr、De-auto，两个数据集的 wMAPE 均高于完整 DEFormer；移除两者回到 PatchTST。该消融支持两个模块在这些实验中的作用，未将目标变换、MMoE 与分类监督分别拆分归因", "Removing either De-corr or De-auto increases wMAPE on both datasets; removing both returns to PatchTST. These ablations support both modules in these experiments, without isolating target transformation, MMoE and classification supervision individually"),
    mechanism:T("再回到挑战中提出的指标：检查稳定秩、Token 相似度，以及高 / 低自相关条件下的分布差异。以下结果与缓解表征趋同的解释相一致，其适用范围仍是论文中的实验条件", "Return to the diagnostic measures: stable rank, token similarity and distribution differences under high versus low autocorrelation. The following results are consistent with mitigating homogenization within the paper’s experimental conditions"),
    fullTables:T("展开完整模型对照 · Table 2", "Expand full model comparisons · Table 2"),
    guides:{
      diagnosis:{question:T("高自相关输入是否伴随更明显的表征趋同？", "Does high input autocorrelation accompany stronger homogenization?"),guide:T("蓝色为初始化，红 / 绿为训练后的高 / 低 ACF。分别比较各层稳定秩的左右位置与 Token 相似度；ACF 即自相关，高 / 低条件按预测窗内平均 ACF 的 0.5 阈值划分", "Blue shows initialization; red/green show trained high/low ACF. Compare stable-rank and token-similarity distributions within each layer. ACF is autocorrelation, split at a mean of 0.5 over the forecast horizon"),insight:T("训练能缓解初始化时的坍缩，但高 ACF 条件仍更容易出现低稳定秩和高 Token 相似度，因此浅层表征也需要检查。这些观察为输入与训练端的设计提供动机", "Training can alleviate initialization collapse, but high ACF still tends toward lower rank and higher token similarity, motivating attention to shallow layers and to both inputs and training")},
      tokenization:{question:T("怎样减轻输入依赖，同时保留销量水平信息？", "How can input dependence be reduced while retaining sales levels?"),guide:T("沿上路看原序列，沿下路看一阶差分；两路分别变换与投影，最后相加得到 Token 表征", "Follow raw values on the upper path and first differences on the lower path. Each is transformed and projected before summation"),insight:T("原序列保留水平信息，差分补充变化信息；模型可以同时利用两者，而不只依赖高度相关的原始序列", "Raw values retain levels and differences add change information, allowing the model to use both rather than relying only on highly correlated raw histories")},
      multitask:{question:T("怎样让监督信号超出单一的连续回归？", "How can supervision extend beyond continuous regression alone?"),guide:T("左侧是单一回归对照；右侧经 MMoE 分出回归与分类，两项损失共同反向传播。目标变换由相邻文字与展开公式说明", "The left shows regression-only supervision; the right uses MMoE to feed regression and classification, with both losses back-propagating. Target transformation is explained in the adjacent text and expandable equations"),insight:T("保留连续预测，同时增加辅助分类监督，改变训练任务的形态；其效果在结果区通过 De-auto 模块消融检验", "Continuous forecasting is retained while auxiliary classification changes the supervision; the De-auto ablation below evaluates this combined module")},
      rank:{question:T("改进后，注意力的有效多样性是否提高？", "Does the method increase effective attention diversity?"),guide:T("按层比较 DEFormer 与 PatchTST；分布向右表示稳定秩更高，左列为高 ACF，右列为低 ACF", "Compare DEFormer and PatchTST within each layer: rightward distributions indicate higher stable rank. High ACF is on the left and low ACF on the right"),insight:T("DEFormer 的稳定秩分布整体更靠右，在高 ACF 条件下差异更明显，与缓解注意力坍缩的解释一致", "DEFormer’s stable-rank distributions shift right, with clearer differences under high ACF, consistent with alleviating attention collapse")},
      similarity:{question:T("改进后，不同 Token 是否更容易区分？", "Do token representations become more distinguishable?"),guide:T("分布越靠左，平均余弦相似度越低；重点比较左列高 ACF 条件下的两种模型", "Leftward distributions indicate lower mean cosine similarity. Focus on the two models under high ACF in the left column"),insight:T("高 ACF 条件下，DEFormer 的 Token 相似度更低；低 ACF 条件下两者分布更接近", "DEFormer has lower token similarity under high ACF; the distributions are closer under low ACF")},
      acf:{question:T("高、低自相关条件下的表征分布差异是否减小？", "Are representation distributions closer across high and low autocorrelation?"),guide:T("这张图的 KS 距离比较同一模型在高 / 低 ACF 下的分布，柱越低表示差异越小；红色为 DEFormer，蓝色为 PatchTST", "Here KS distance compares high/low ACF distributions within each model. Lower bars indicate smaller differences; red is DEFormer and blue is PatchTST"),insight:T("六组指标的 KS 距离均更小，支持 DEFormer 在两种 ACF 条件下表征差异减小；该指标衡量分布差异，不直接衡量预测准确率", "KS distances are lower for all six measures, supporting smaller representation differences across ACF conditions. This measures distribution differences, not forecast accuracy")}
    }
  },
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
  narrative:{
    sections:[
      {key:"context",title:T("背景", "Background"),heading:T("数据留在各场站，预测仍需要协作", "Collaborate on forecasting while keeping each farm’s data local")},
      {key:"challenge",title:T("挑战", "Challenge"),heading:T("共同规律、本地差异与特征关系如何兼顾？", "How can shared patterns, local differences and feature relations coexist?")},
      {key:"approach",title:T("方案与贡献", "Solution & contributions"),nav:T("方案与贡献", "Solution"),heading:T("先划分共享范围，再设计本地预测模型", "Define what to share, then design the local forecaster")},
      {key:"results",title:T("结果", "Results"),heading:T("分别验证协作收益与图模块的作用", "Evaluate collaboration and graph components separately")}
    ],
    background:T("多风电场都需要预测未来功率，也可能从共同的风电与气象规律中受益。研究目标是在原始数据留在各场站的条件下开展协作，并保留各场站自己的时间变化模式", "Wind farms need future power forecasts and can benefit from shared power and meteorological patterns. The goal is collaboration with raw data retained at each farm and with local temporal patterns preserved"),
    context:T("所提供的 2023 年修订稿使用 NREL 2013–2014 年、5 分钟粒度的数据：加州 NW 8 个场站、SE 19 个场站；评估未来 30 分钟、1 小时与 2 小时的功率预测", "The supplied 2023 revision uses NREL’s 2013–2014 five-minute data from 8 NW and 19 SE farms in California, evaluating 30-minute, 1-hour and 2-hour power forecasts"),
    challenges:[
      {title:T("协作范围：共享什么，保留什么", "Collaboration: what to share and what to retain"),body:T("原始数据需要留在本地；全模型参数聚合又可能削弱场站差异并增加通信负担，因此需要明确共同学习与本地个性化的边界", "Raw data must remain local. Aggregating the entire model can weaken site differences and increase communication, so shared learning needs a clear boundary from local personalization")},
      {title:T("本地建模：特征关系不是固定不变的", "Local modeling: feature relationships are not fixed"),body:T("功率、风速、风向、温度等特征相互关联。固定图结构难以充分表达这些关系，模型还要把特征关系与时间依赖结合起来", "Power, wind speed, direction and temperature are related. A fixed graph can limit those relationships, which also need to be combined with temporal dependencies")}
    ],
    contribution:T("我的贡献：参与本地 GIN 与 CPLF 协作机制的方法设计、代码实现和实验分析，并参与英文论文修订；相关论文为共同第一作者", "My contribution: method design, implementation and experiments for local GIN and CPLF collaboration, plus English manuscript revision; co-first author of the related paper"),
    bridge:T("CPLF 解决场站之间如何共享模型信息；GIN / SiDGI 解决每个场站内部如何建模。这里的图节点是功率与气象特征，跨场站协作通过参数聚合实现", "CPLF determines how farms share model information; GIN/SiDGI models relationships within each farm. Graph nodes are power and meteorological features, while cross-farm collaboration uses parameter aggregation"),
    methods:[
      {title:T("CPLF：共享空间模块，保留本地时间模块", "CPLF: share spatial modules, retain local temporal modules"),body:T("将模型划分为空间与时间两部分。各场站本地训练后，仅上传加密的空间模块参数参与聚合，时间模块保留本地，最后一轮再进行本地微调，使共享规律与场站差异各有对应的学习路径", "Partition the model into spatial and temporal parts. After local training, farms aggregate only encrypted spatial-module parameters and retain temporal modules locally, followed by final-round local fine-tuning. Shared patterns and site differences thus have separate learning paths"),figure:0,
        guide:{question:T("哪些信息参与协作，哪些留在本地？", "Which information is shared and which remains local?"),guide:T("从左向右看本地预处理、训练与聚合；红色框和箭头对应传输的空间参数，蓝色框对应保留本地的时间部分；末轮进入本地微调", "Read left to right through local preprocessing, training and aggregation. Red outlines/arrows mark transmitted spatial parameters; blue outlines mark retained temporal parts. The final round leads to local fine-tuning"),insight:T("协作的关键是参数分区：空间模块参与聚合，时间模型保留场站个性化。其预测收益在下方用 CPLF 与独立训练的对照检验", "The key is partitioned parameters: spatial modules collaborate, while temporal models retain site personalization. CPLF versus Standalone below tests the forecasting benefit")}},
      {title:T("本地 GIN：把特征关系与时间依赖结合起来", "Local GIN: combine feature relations with temporal dependencies"),body:T("在每个场站内部，SiDGI 学习功率与气象特征之间的关系，位置与时间嵌入补充时序信息，再交给 Encoder–Decoder 输出多步预测", "Within each farm, SiDGI learns relations among power and meteorological features. Position and time embeddings add temporal information before an Encoder–Decoder generates multi-step forecasts"),figure:1,
        guide:{question:T("特征图怎样进入多步预测？", "How does a feature graph enter a multi-step forecast?"),guide:T("从下向上看：Encoder 与 Decoder 的输入分别经过嵌入分支和 SiDGI 分支，相加后进入时间模型；左侧编码历史，右侧输出未来序列", "Read from bottom to top: encoder and decoder inputs pass through embedding and SiDGI branches, then are added before temporal modeling. The left encodes history and the right generates future values"),insight:T("图模块负责特征关系，Encoder–Decoder 负责时间建模；两者共同构成本地预测器，而不是用图节点表示不同风电场", "Graph modules model feature relations and the Encoder–Decoder models temporal behavior. Together they form a local forecaster; graph nodes do not represent different farms")}},
      {title:T("SiDGI：学习有向结构，再校准边权", "SiDGI: learn directed structure, then calibrate edge weights"),body:T("用两组可学习节点嵌入生成有向邻接矩阵，通过 top-k 保留稀疏边，再由多头 GAT 根据输入序列校准边权，使结构学习与输入相关的权重调整分开进行", "Two learnable node embeddings generate a directed adjacency matrix; top-k keeps sparse edges, and multi-head GAT calibrates weights using input sequences. Structure learning and input-dependent weight adjustment are separate stages"),figure:2,
        guide:{question:T("图的连接结构和边权分别如何确定？", "How are graph connections and edge weights determined?"),guide:T("左半部分从 Node Embedding 生成初始有向图，Mask 对应稀疏筛选；右半部分把输入与初始图送入 GAT，再输出图表征", "The left generates an initial directed graph from node embeddings, with Mask selecting sparse edges. The right combines inputs and that graph in GAT to produce graph representations"),insight:T("先学习哪些特征应连接，再根据输入调整连接强度；下方三个替代配置分别检验 SiDGI、边权校准与图生成的作用", "First learn which features connect, then adjust connection strengths from the input. Three alternatives below test SiDGI, edge calibration and graph generation")},
        equation:{title:T("从节点嵌入学习有向关系", "Learn directed relations from node embeddings"),formula:String.raw`A_{\mathrm{raw}} = \operatorname{PReLU}\!\left(M_1M_2^{\mathsf{T}}-M_2M_1^{\mathsf{T}}\right)`,note:T(String.raw`\(M_1\)、\(M_2\) 是两组节点嵌入的线性映射；再通过 top-k 稀疏化与 GAT 校准边权`, String.raw`\(M_1\) and \(M_2\) are linear mappings of node embeddings; top-k sparsification and GAT refine the edges`)}}
    ],
    resultIntro:T("先以独立本地训练为参照检验协作，再用替代配置检验图模块，最后查看完整本地模型对照。下方 MAPE 统一转换为百分比，降幅仍按相对变化计算", "First compare collaboration with independent local training, then test graph components against alternatives, and finally inspect full local-model comparisons. MAPE is displayed as percentages; reductions remain relative changes"),
    resultBlocks:[
      {title:T("协作收益：CPLF 是否优于独立训练？", "Collaboration: does CPLF outperform Standalone?"),body:T("1 小时预测中，NW MAPE 从 5.710% 降至 5.000%，SE 从 5.360% 降至 4.870%，相对下降约 12.4% / 9.1%。同一表中的 30 分钟与 2 小时结果也可用于检查不同预测窗", "For 1-hour forecasts, NW MAPE falls from 5.710% to 5.000% and SE from 5.360% to 4.870%, relative reductions of about 12.4%/9.1%. The same table includes 30-minute and 2-hour horizons"),tables:[1]},
      {title:T("模块作用：图生成与边权校准是否有帮助？", "Components: do graph generation and edge calibration help?"),body:T("完整 GIN 在两个区域、三个预测窗的 MAPE 均低于所列三个替代配置。消融与上方方法一一对应，支持这些模块在所给实验条件下的作用", "Full GIN has lower MAPE than all three listed alternatives across both regions and all three horizons. The ablations correspond to the methods above and support their roles in these experiments"),tables:[2]},
      {title:T("完整对照：更换本地模型后表现如何？", "Full comparisons: what happens with other local models?"),body:T("Table II 比较联邦实验中的本地模型。各模型的参数传输配置按修订稿执行，应与上方 CPLF / Standalone 对照分开阅读", "Table II compares local models in federated experiments, with parameter-transmission settings following the revision. Read this separately from the CPLF/Standalone comparison above"),tables:[0],collapsed:true}
    ],
    boundary:T("数值来自所提供的 2023 年修订稿；相关论文发表于 2025 年。这里展示预测与模块对照，隐私保护程度和通信节省不能仅由 MAPE 推断", "Values come from the supplied 2023 revision; the related paper was published in 2025. These comparisons evaluate forecasts and components; MAPE alone does not quantify privacy protection or communication savings"),
    publication:{venue:"IEEE Transactions on Network Science and Engineering",year:"2025",authorship:T("共同第一作者", "Co-first author")}
  },
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
  narrative:{
    sections:[
      {key:"context",title:T("背景", "Background"),heading:T("日前电价决策既需要预测值，也需要风险范围", "Day-ahead price decisions need estimates and a range of uncertainty")},
      {key:"challenge",title:T("挑战", "Challenge"),heading:T("时间变化、特征权重与不确定性需要分别处理", "Temporal variation, feature weights and uncertainty need separate treatment")},
      {key:"approach",title:T("方案与贡献", "Solution & contributions"),nav:T("方案与贡献", "Solution"),heading:T("依次设计时间表征、特征融合与预测目标", "Design temporal representations, feature fusion and prediction targets")},
      {key:"results",title:T("结果", "Results"),heading:T("分别评估点误差、区间质量与计算代价", "Evaluate point error, interval quality and computation separately")}
    ],
    background:T("日前市场的报价、购售电与风险评估，需要对未来价格形成判断。点预测给出一个数值，区间预测补充可能的波动范围；两类输出服务于不同的决策需求", "Bidding, energy purchases/sales and risk assessment in day-ahead markets require a view of future prices. A point forecast gives a value; interval forecasts add a range of uncertainty. The outputs serve different decision needs"),
    context:T("研究使用瑞典、挪威、丹麦、芬兰 2018–2019 年小时数据，按时间顺序前 70% 训练、后 30% 测试。输入包括价格、功率交换、发电、用电、容量，以及部分市场的风电特征；采用 Pearson 系数 ≥ 0.5 的特征筛选条件", "The study uses hourly 2018–2019 data from Sweden, Norway, Denmark and Finland, split chronologically into 70% training and 30% testing. Inputs include prices, power exchanges, generation, consumption, capacity and wind features in some markets, with Pearson coefficient ≥ 0.5 for feature selection"),
    challenges:[
      {title:T("时间表征：同时捕捉短期变化与长期依赖", "Temporal representations: short-term changes and longer dependencies"),body:T("电价既有局部波动，也有更长的时间依赖；加深模型还需要处理退化与过拟合，不能只增加层数", "Prices combine local fluctuations with longer dependencies. Deeper models also need to address degradation and overfitting rather than simply adding layers")},
      {title:T("特征融合：重要性会随输入变化", "Feature fusion: importance changes with the input"),body:T("不同特征对预测的作用需要动态加权，同时保留一条不同的表达路径，供最终预测融合", "Feature contributions need input-dependent weights, alongside an alternate representation path for the final forecast")},
      {title:T("预测输出：误差低不等于区间好", "Forecast outputs: low point error does not imply good intervals"),body:T("点预测评估数值误差；区间预测还要兼顾区间宽度与区间外误差，因此需要对应的损失与指标", "Point forecasts evaluate value errors. Intervals must also account for width and out-of-interval errors, requiring their own losses and measures")}
    ],
    contribution:T("我的贡献：参与 ARUCNN–GRU 与 Dense Skip Attention 的方法设计、代码实现和实验分析，并参与英文论文写作与修订；相关论文为第二作者", "My contribution: method design, implementation and experiments for ARUCNN–GRU and Dense Skip Attention, plus English manuscript writing and revision; second author of the paper"),
    bridge:T("先提取短期与长期时间依赖，再沿特征轴学习权重并融合跳跃旁路，最后按点预测或区间预测选择监督目标。每一步对应上方一种挑战", "Extract short- and longer-term temporal dependencies, learn weights along the feature axis and fuse a skip path, then choose supervision for point or interval forecasts. Each step addresses a challenge above"),
    methods:[
      {title:T("ARUCNN–GRU：提取时间依赖并引入正则化", "ARUCNN–GRU: temporal dependencies and regularization"),body:T("非共享卷积与残差映射提取短期变化，GRU 建模更长的时间依赖；Drop-connected 结构用于正则化。整体框架将时间表征交给特征融合模块，再进入两种回归模式", "Non-shared convolutions and residual mappings extract short-term changes; GRU models longer dependencies, with drop-connected structure for regularization. Temporal representations feed feature fusion and then one of two regression modes"),figure:0,
        guide:{question:T("从输入到预测输出，各模块分别负责什么？", "What does each module do between inputs and predictions?"),guide:T("按编号 ①–⑤ 阅读：原始数据 → 预处理 → UCNN–GRU → Dense Skip Attention → 目标回归。最后两条分支表示两种预测模式", "Follow steps ①–⑤: raw data → preprocessing → UCNN–GRU → Dense Skip Attention → target regression. The two final branches show two forecasting modes"),insight:T("时间建模、特征加权和输出任务是三个可分别讨论的设计环节；同一框架按任务选择损失，两条分支并不表示一次训练同时输出两种结果", "Temporal modeling, feature weighting and output tasks are distinct design stages. The framework selects a loss by task; the branches do not imply both outputs from one joint training run")},
        details:{title:T("展开网络配置与训练细节", "Expand network and training details"),decision:0}},
      {title:T("Dense Skip Attention：特征轴加权与跳跃旁路", "Dense Skip Attention: feature weighting and a skip path"),body:T("主路通过 Seq2Seq GRU 与维度置换，沿特征轴计算注意力；旁路通过另一组 GRU、Dense 与 PReLU 提供替代表达。两路相加后进入全连接层，融合加权特征与跳跃映射", "The main path uses Seq2Seq GRU and axis permutation for feature-wise attention. Another GRU, Dense and PReLU form a skip path. Their sum feeds the final fully connected layer, combining weighted features with the alternate mapping"),figure:1,
        guide:{question:T("注意力加权以后，为什么还保留旁路？", "Why retain a skip path alongside attention weighting?"),guide:T("下方红框是特征加权主路，上方橙框是跳跃旁路；跟随两条箭头到右侧 Σ，随后进入最终全连接层", "The lower red box is the feature-weighted path; the upper orange box is the skip path. Follow both arrows to Σ and then the final fully connected layer"),insight:T("融合发生在两路表达相加的位置。这里的注意力沿特征轴计算，应与单纯沿时间轴加权区分", "Fusion occurs where the two representations are added. Attention here is along the feature axis, distinct from weighting time positions alone")},
        equation:{title:T("注意力主路与跳跃旁路融合", "Combine attention and skip paths"),formula:String.raw`Y_i^{*} = \phi(g_i)+\rho(g_i)`,note:T(String.raw`\(\phi\) 表示特征加权主路，\(\rho\) 表示跳跃旁路；两路相加后进入最终全连接层`, String.raw`\(\phi\) is the feature-weighted main path and \(\rho\) is the skip path; their sum feeds the final fully connected layer`)}},
      {title:T("预测目标：按任务选择损失与评估指标", "Prediction targets: choose losses and measures by task"),body:T(String.raw`点预测使用 MAE；区间模式使用平滑分位损失，分别训练 \(\alpha=0.05\) / \(0.95\) 两种设置，展示名义 90% 区间。点预测用 MAPE 等指标衡量数值误差；区间预测用 RWS 与两组 MPL 衡量区间和分位质量`, String.raw`Point forecasting uses MAE. Interval mode uses smooth quantile loss with separately trained \(\alpha=0.05\) / \(0.95\) settings to show nominal 90% intervals. MAPE and other point metrics measure value errors; RWS and two MPL measures evaluate intervals and quantiles`)}
    ],
    resultIntro:T("先看四个市场的点预测，再看区间质量，最后检查精度提升所需的计算资源。三类指标分别回答不同问题", "Inspect point forecasts across four markets, then interval quality, and finally the computation required. Each set of measures answers a different question"),
    resultBlocks:[
      {title:T("点预测：四个市场的误差是否改善？", "Point forecasts: do errors improve across four markets?"),body:T("Proposed 的 MAPE 在四个市场均低于表中所列基线。上方摘要展示各市场的绝对 MAPE；完整对照可展开查看", "Proposed has lower MAPE than the listed baselines in all four markets. The summary shows absolute MAPE by market; expand the complete comparisons below"),tables:[0],collapsed:true},
      {title:T("区间预测：同时衡量宽度与区间外误差", "Intervals: evaluate width and out-of-interval error together"),body:T("RWS 在瑞典 / 挪威 / 丹麦 / 芬兰分别为 0.125 / 0.089 / 0.111 / 0.203，低于所列对照。该指标综合区间宽度与区间外误差，不应当作点预测准确率或实际覆盖率", "RWS is 0.125/0.089/0.111/0.203 in Sweden/Norway/Denmark/Finland, below the listed comparators. It combines interval width with out-of-interval errors, rather than measuring point accuracy or empirical coverage"),tables:[1]},
      {title:T("分位验证：分别检查两个分位设置", "Quantile checks: examine each setting separately"),body:T("MPL 对两种分位设置分别评估；保留原表数值和符号说明，可展开核对", "MPL evaluates the two quantile settings separately. The original values and notation remain available below"),tables:[2,3],collapsed:true},
      {title:T("计算取舍：更低误差需要多少资源？", "Computation: what resources accompany lower error?"),body:T("瑞典数据集上，Proposed 的参数量为 248,421、训练与验证合计 1,026.22 秒；GRU 为 179,989 和 772.93 秒。精度改善伴随更高资源需求，这些时间不代表线上推理延迟", "On Sweden, Proposed uses 248,421 parameters and 1,026.22 seconds for training plus validation; GRU uses 179,989 and 772.93 seconds. Accuracy gains accompany greater resource use; these times are not inference latency"),tables:[4]}
    ],
    boundary:T("结果对应所提供接收稿中的四国历史数据与时间划分。名义 90% 区间是目标设置，实际覆盖表现需要对应实验检查；预测结果不直接证明报价策略的收益", "Results correspond to the supplied accepted manuscript’s four-country historical data and time split. Nominal 90% intervals are a target setting, with empirical coverage requiring its own check; forecasting results do not directly establish bidding returns"),
    publication:{venue:"IEEE Transactions on Power Systems",year:"2023",authorship:T("第二作者", "Second author")}
  },
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
// Original figures and qualitative method comparisons from the supplied Review.
const reviewResearchStudy = {
  narrative:{
    sections:[
      {key:"context",title:T("背景", "Background"),heading:T("新能源的不确定性贯穿整个运行系统", "Renewable uncertainty spans the operational system")},
      {key:"challenge",title:T("挑战", "Challenge"),heading:T("如何把 AI 方法放回运行目标与物理约束？", "How can AI methods be assessed against objectives and physical constraints?")},
      {key:"approach",title:T("方案与贡献", "Approach & contributions"),nav:T("方案与贡献", "Approach"),heading:T("按运行任务组织文献，再比较方法与适用边界", "Organize the literature by task, then compare methods and applicability")},
      {key:"results",title:T("结果", "Results"),heading:T("形成任务框架、方法对照与研究展望", "Produce a task framework, method comparisons and research outlook")}
    ],
    background:T("高比例新能源接入增加发电的不确定性，也影响供需平衡、电网稳定性和市场决策。研究需要从系统运行的实际任务出发，理解 AI 在哪些环节提供预测或决策支持", "High renewable penetration increases generation uncertainty and affects supply–demand balance, grid stability and market decisions. The study starts from operational tasks to understand where AI provides forecasting or decision support"),
    context:T("这是一项文献综述，覆盖预测、调度、控制与电力市场四类运行任务，以及机器学习、深度学习和强化学习三类方法范式；依据所提供论文的 Figures 1–4 与 Table 1 整理", "This literature review covers forecasting, dispatch, control and electricity markets, alongside machine learning, deep learning and reinforcement learning. It is organized from Figures 1–4 and Table 1 of the supplied paper"),
    challenges:[
      {title:T("任务差异：预测数值与选择动作不是同一目标", "Task differences: predicting values and selecting actions have different goals"),body:T("预测关注未来发电、负荷或价格；调度和控制还要选择可执行动作；市场包含多个参与者的交互。不能只按模型名称比较这些任务", "Forecasting concerns future generation, load or prices; dispatch and control require executable actions; markets involve interacting participants. Model names alone are insufficient for comparison")},
      {title:T("适用边界：精度之外还有约束与计算代价", "Applicability: constraints and computation matter alongside accuracy"),body:T("不同方法需要不同数据、动作空间与环境假设，也受到物理安全、实时性及计算资源限制。综述需要把这些条件与方法能力一起解释", "Methods differ in their data, action spaces and environmental assumptions, with physical safety, timeliness and computation imposing further limits. The review connects these conditions to method capabilities")}
    ],
    contribution:T("我的贡献：独立完成相关章节的文献研究、英文写作与修订，并参与投稿前修订；论文为第二作者，贡献声明记录资料研究、写作和修订工作", "My contribution: independent literature research, writing and revision of the relevant sections, plus pre-submission revision; second author, with research, writing and revision recorded in the contribution statement"),
    bridge:T("采用“任务与输入 → 方法机制 → 输出与约束”的比较框架。下面四张图分别解释四类任务中的典型路线，用来帮助理解方法的位置和适用条件", "Use a comparison framework of tasks and inputs → method mechanisms → outputs and constraints. The four figures explain typical routes for each task, showing where methods fit and under what conditions"),
    methods:[
      {decision:0,figure:0,guide:{question:T("预测任务中，不同模型学习什么关系？", "What relationships do different forecasting models learn?"),guide:T("从左侧输入和右侧预测对象建立任务边界，再比较中间卷积、循环与注意力三类机制", "Establish the task from inputs on the left and forecast targets on the right, then compare convolutional, recurrent and attention mechanisms in the middle"),insight:T("模型比较需要对应预测对象、时间依赖与计算代价；图中的典型结构是文献归纳，具体效果仍取决于实验设置", "Compare models against forecast targets, temporal dependencies and computation. These typical architectures synthesize the literature; performance remains setting-dependent")}},
      {decision:1,figure:1,collapsedFigure:true,guide:{question:T("调度任务中，AI 如何连接约束与决策变量？", "How does AI connect constraints to dispatch decisions?"),guide:T("先看左侧 OPF、经济调度和机组组合的输入，再看右侧决策变量；中间分别展示 ML、DL 与 Actor–Critic 的处理路线", "Start with OPF, economic-dispatch and unit-commitment inputs on the left and decision variables on the right; the middle shows ML, DL and actor–critic routes"),insight:T("候选解生成、端到端估计和策略优化对应不同处理方式，最终方案仍需满足各任务的运行约束", "Candidate generation, end-to-end estimation and policy optimization are distinct routes; their decisions still need to satisfy each task’s operational constraints")}},
      {decision:2,figure:2,collapsedFigure:true,guide:{question:T("从系统状态到控制动作，中间需要哪些环节？", "What links system states to control actions?"),guide:T("左侧是发电、输配电、需求和储能子系统；中间监测与建模提供信息给下方控制器，右侧对应需要调节的变量", "The left lists generation, transmission/distribution, demand and storage. Monitoring and modeling feed the controller below; the right lists variables to regulate"),insight:T("识别状态、建立响应模型与选择动作需要分别讨论，动作空间、实时性和物理稳定性共同限制方法选择", "State identification, response modeling and action selection require separate discussion. Action spaces, timeliness and physical stability constrain method choice")}},
      {decision:3,figure:3,collapsedFigure:true,guide:{question:T("单智能体与多智能体如何表达市场交互？", "How do single- and multi-agent methods represent market interaction?"),guide:T("左侧区分批发与零售结构；右侧上半部分是单一竞价智能体，下半部分是多个智能体与聚合、出清机制的交互", "The left distinguishes wholesale and retail structures. On the right, the upper route uses a single bidding agent; the lower route links multiple agents to aggregation and clearing"),insight:T("市场方法的适用性依赖参与者与出清规则等假设；多智能体更明确地表示交互，也带来规模与计算问题", "Applicability depends on participant and clearing-rule assumptions. Multiple agents represent interactions explicitly while raising scale and computational challenges")}}
    ],
    resultIntro:T("综述的成果是覆盖四类任务的比较框架与方法适用性整理。下方的“4 / 3”表示覆盖范围，方法表归纳文献条件；这些内容不作为新模型的性能实验", "The review produces a comparative framework across four tasks and a synthesis of method applicability. The counts below describe scope and the tables summarize literature conditions; they are not performance experiments for a new model"),
    resultBlocks:[
      {title:T("方法对照：用同一组问题阅读四类任务", "Method comparisons: ask consistent questions across four tasks"),body:T("按任务、关键特征与适用条件核对方法。四张表分别保留预测窗与计算开销、调度约束、控制动作空间以及市场参与者假设，避免把不同任务压缩成一个通用排名", "Compare tasks, key features and applicability. The four tables retain forecast horizons/computation, dispatch constraints, control action spaces and market-participant assumptions, avoiding a universal ranking across different tasks"),tables:[0,1,2,3],collapsed:true}
    ],
    boundary:T("研究展望来自论文 Outlook，保留为未来方向；文献中的方法和应用条件不等于本人实现或部署了这些系统", "The outlook retains future directions from the paper. Methods and application conditions in the literature do not imply that I implemented or deployed those systems"),
    publication:{venue:"Nature Reviews Electrical Engineering",year:"2024",authorship:T("第二作者", "Second author")}
  },
  kind:"review",
  paperURL:"https://doi.org/10.1038/s44287-024-00018-9",
  sourceNote:T("依据所提供论文版本的 Figures 1–4 与 Table 1 整理；下表归纳文献中的方法与适用条件，研究展望保留为未来方向", "Based on Figures 1–4 and Table 1 in the supplied paper. The tables synthesize methods and applicability from the literature; the outlook retains its status as future research"),
  figures:[
    {number:1,src:"assets/review/figure-1-forecast.png",width:1578,height:1122,
      title:T("新能源预测：输入、模型与预测对象", "Renewable forecasts: inputs, models and targets"),
      note:T("论文原图 1 · 天气、历史发电、负荷和电价构成输入；卷积、循环与注意力模型分别学习局部模式、时间依赖与样本关系，输出发电量、负荷或电价预测", "Paper Figure 1 · Weather and historical generation, load and prices form the inputs. Convolutional, recurrent and attention models learn local patterns, temporal dependencies and sample relationships to forecast generation, load or prices")},
    {number:2,src:"assets/review/figure-2-dispatch.png",width:1578,height:1218,
      title:T("调度：最优潮流、经济调度与机组组合", "Dispatch: optimal power flow, economic dispatch and unit commitment"),
      note:T("论文原图 2 · 对照 ML、DL 和 Actor–Critic 强化学习，讨论发电、储能与可调负荷在成本和安全约束下的资源配置", "Paper Figure 2 · ML, DL and actor–critic RL support resource allocation across generation, storage and flexible loads under cost and security constraints")},
    {number:3,src:"assets/review/figure-3-control.png",width:1578,height:1122,
      title:T("控制：监测、建模与控制器协同", "Control: monitoring, modeling and controllers"),
      note:T("论文原图 3 · 发电、输配电、负荷与储能向监测和建模模块提供状态；控制器据此生成动作，面向电压、频率及系统稳定性调节", "Paper Figure 3 · Generation, transmission/distribution, demand and storage provide states for monitoring and modeling. Controllers generate actions to regulate voltage, frequency and system stability")},
    {number:4,src:"assets/review/figure-4-markets.png",width:1578,height:771,
      title:T("电力市场：单智能体与多智能体决策", "Electricity markets: single- and multi-agent decisions"),
      note:T("论文原图 4 · 区分批发与零售市场，展示需求、价格和设备状态如何支持竞价策略，以及多参与者与市场出清机制之间的交互", "Paper Figure 4 · Wholesale and retail markets use demand, prices and device states to support bidding strategies and interactions between participants and market-clearing mechanisms")}
  ],
  summary:[
    {label:T("运行任务", "Operational tasks"),value:"4",note:T("预测 · 调度 · 控制 · 电力市场", "Forecasts · Dispatch · Control · Markets")},
    {label:T("AI 方法范式", "AI paradigms"),value:"3",note:T("机器学习 · 深度学习 · 强化学习", "Machine learning · Deep learning · Reinforcement learning")}
  ],
  tables:[
    {title:T("Table 1 · 预测方法与适用条件", "Table 1 · Forecasting methods and applicability"),collapsed:true,highlight:false,
      headers:[T("方法", "Method"),T("任务", "Task"),T("关键特征", "Key feature"),T("适用条件与局限", "Applicability and limits")],
      groups:[{rows:[
        ["SVR",T("风功率与风速预测", "Wind power and speed"),T("参数较少，通过核函数表达非线性关系", "Few parameters; kernels model nonlinear relations"),T("对核函数和超参数敏感", "Sensitive to kernel and hyperparameter choices")],
        ["CNN",T("光伏功率预测", "Photovoltaic power"),T("局部卷积与权重共享，提取短期变化", "Local convolutions and shared weights extract short-term changes"),T("可堆叠扩展，但较经典 ML 更复杂", "Scalable and stackable, with more complexity than classical ML")],
        ["TCN",T("光伏功率预测", "Photovoltaic power"),T("扩张卷积扩大感受野，因果设计减少信息泄漏", "Dilated convolutions enlarge the receptive field; causality limits leakage"),T("适合超短期依赖，长期预测能力受限", "Suited to immediate dependencies; limited long-range modeling")],
        ["GRU",T("风功率预测", "Wind power"),T("门控与记忆机制建模时间依赖", "Gating and memory model temporal dependencies"),T("论文指出短期波动和长预测窗仍有局限", "The review notes limits for short-term fluctuations and long horizons")],
        ["Transformer",T("风功率与太阳辐照度预测", "Wind power and solar irradiance"),T("自注意力建模长短期关系", "Self-attention models long- and short-term relationships"),T(String.raw`较高参数与计算开销；标准注意力为 \(O(L^2)\)`, String.raw`Higher parameter and computation costs; standard attention is \(O(L^2)\)`) ],
        ["Informer",T("通用时序预测", "General forecasting"),T("在自注意力中引入稀疏性", "Introduces sparsity into self-attention"),T(String.raw`降低注意力计算开销，论文给出 \(O(L\log L)\)`, String.raw`Reduces attention cost; the review gives \(O(L\log L)\)`) ]
      ]}],note:T("依据 Table 1 与预测章节选取关键特征；上述适用条件来自综述归纳，具体效果仍取决于数据、预测窗及模型配置", "Key features selected from Table 1 and the forecasting section. Applicability reflects the review’s synthesis; performance depends on data, horizon and model configuration")},
    {title:T("Table 1 · 调度方法与运行约束", "Table 1 · Dispatch methods and operational constraints"),collapsed:true,highlight:false,
      headers:[T("方法", "Method"),T("任务", "Task"),T("关键特征", "Key feature"),T("适用条件与局限", "Applicability and limits")],
      groups:[{rows:[
        ["ELM",T("经济调度", "Economic dispatch"),T("为调度求解器生成候选方案", "Generates candidates for a dispatch solver"),T("可估计非线性关系，近似能力限制直接最优求解", "Estimates nonlinear relations; approximation limits direct optimal solutions")],
        ["CNN",T("交流最优潮流", "AC optimal power flow"),T("从网络输入估计潮流与安全状态", "Estimates power flow and security states from network inputs"),T("神经网络结构与拓扑需要审慎设计", "Requires careful network architecture and topology design")],
        ["DNN",T("交流最优潮流", "AC optimal power flow"),T("将离散拓扑嵌入连续导纳空间", "Embeds discrete topology in a continuous admittance space"),T("可处理特定设置下的不同拓扑；高维问题需要较大网络", "Handles different topologies under specified settings; high dimensions require larger networks")],
        ["PPO",T("日前机组组合", "Day-ahead unit commitment"),T("用强化学习策略引导树搜索", "Uses an RL policy to guide tree search"),T("随机组数增加具有时间效率优势，效果依赖新能源预测精度", "Time efficient as generator counts increase; relies on renewable forecast accuracy")]
      ]}],note:T("OPF、经济调度与机组组合分别对应不同决策变量和时间尺度，均需要满足各自运行约束", "OPF, economic dispatch and unit commitment have different decision variables and timescales, with their own operational constraints")},
    {title:T("Table 1 · 控制方法与动作空间", "Table 1 · Control methods and action spaces"),collapsed:true,highlight:false,
      headers:[T("方法", "Method"),T("任务", "Task"),T("关键特征", "Key feature"),T("适用条件与局限", "Applicability and limits")],
      groups:[{rows:[
        ["Random Forest",T("子系统响应建模", "Subsystem response modeling"),T("提供特征重要性，建立数据驱动响应模型", "Provides feature importance and data-driven response models"),T("参数敏感，性能取决于具体设置", "Parameter sensitive; performance depends on the setting")],
        ["PSO",T("控制决策搜索", "Control decision search"),T("搜索高维状态空间，跳出局部最优", "Searches high-dimensional spaces beyond local optima"),T("参数敏感，求解及时性难以保证", "Parameter sensitive, with no guaranteed timeliness")],
        ["ANN",T("子系统响应建模", "Subsystem response modeling"),T("从历史数据构造非线性响应模型", "Builds nonlinear response models from historical data"),T("可扩展，但计算复杂度高于经典 ML", "Scalable, with higher computational complexity than classical ML")],
        ["DQN",T("控制动作选择", "Control action selection"),T("通过环境交互近似状态或动作价值", "Approximates state or action values through interaction"),T("适合离散动作空间；连续动作适配受限", "Suited to discrete actions; limited applicability to continuous actions")],
        ["DDPG",T("控制策略学习", "Control policy learning"),T("环境交互与经验回放支持策略学习", "Interaction and replay support policy learning"),T("支持连续动作，对环境变化的鲁棒性仍有不足", "Supports continuous actions, with limits in robustness to environmental changes")]
      ]}],note:T("按 Table 1 的任务、方法特征与适用条件归纳；稳定性与实时性需要结合具体物理系统评估", "Synthesized from the tasks, features and applicability in Table 1. Stability and real-time behavior require evaluation in the specific physical system")},
    {title:T("Table 1 · 市场方法与多参与者交互", "Table 1 · Market methods and participant interactions"),collapsed:true,highlight:false,
      headers:[T("方法", "Method"),T("任务", "Task"),T("关键特征", "Key feature"),T("适用条件与局限", "Applicability and limits")],
      groups:[{rows:[
        ["SVM",T("市场力或合谋识别", "Market power or collusion detection"),T("从交易数据学习合谋相关特征", "Learns collusion-related features from trading data"),T("结果受训练数据和特征质量影响", "Depends on training data and features")],
        [T("单智能体 RL", "Single-agent RL"),T("竞价决策", "Bidding decisions"),T("为一个参与者建立策略智能体", "Models a policy agent for one participant"),T("可处理非凸约束，其他参与者的简化可能偏离真实市场", "Handles non-convex constraints; simplifying other participants can depart from reality")],
        [T("多智能体 RL", "Multi-agent RL"),T("竞价与交互决策", "Bidding and interaction decisions"),T("多个参与者分别学习策略并开展博弈", "Multiple participants learn policies and interact strategically"),T("更贴近多方竞价，问题规模与计算难度随智能体数变化", "Closer to multi-party bidding; size and computational difficulty depend on agent count")]
      ]}],note:T("覆盖批发与零售市场的竞价、出清与交易研究；方法适用性需要结合市场机制与参与者假设判断", "Covers bidding, clearing and trading in wholesale and retail markets. Applicability depends on market mechanisms and participant assumptions")}
  ],
  outlook:[
    {title:T("分布式高比例新能源", "Distributed systems with high renewable penetration"),body:T("作者提出结合联邦学习与图学习，探索跨场站时空关联，并处理空间拓扑和协作学习中的隐私要求", "The authors propose combining federated and graph learning to study cross-site spatiotemporal relations while addressing privacy in spatial topology and collaboration")},
    {title:T("多形态储能协同", "Coordination of diverse storage technologies"),body:T("针对储能类型、充放电速度、规模与应用场景差异，讨论 Meta-RL 对多任务适应和统一调度控制的潜力", "For differences in storage type, charge/discharge speed, scale and use, the review discusses meta-RL’s potential for task adaptation and unified dispatch/control")},
    {title:T("复杂市场与可解释决策", "Complex markets and interpretable decisions"),body:T("面对异构参与者和多市场耦合，讨论模仿学习与强化学习结合，以利用运营者经验并改善决策可解释性", "For heterogeneous participants and coupled markets, the review discusses combining imitation learning with RL to use operator experience and improve interpretability")}
  ]
};

// Public architecture summaries; no private research pages or runtime artifacts are embedded.
const wikiStudy = {
  figures:[
    {label:"SYSTEM ARCHITECTURE",src:T("assets/wiki/architecture-zh.svg","assets/wiki/architecture-en.svg"),width:960,height:540,
      title:T("证据、派生产物与正式知识页分层", "Separate evidence, derived artifacts and Canonical knowledge"),
      note:T("Codex 按任务调用 Skills 与 Python 工具；原始文档和视频保留来源身份，预处理产物留在派生层。论断、覆盖状态和页面草稿经过具名审批与独立验收，再形成可检索的六类知识页", "Codex invokes Skills and Python tools by task. Source documents and videos retain their identities, while preprocessing outputs remain derived artifacts. Claims, coverage and page drafts pass exact-page approval and independent verification before entering six queryable page types")},
    {label:"VIDEO EVIDENCE",src:T("assets/wiki/video-zh.svg","assets/wiki/video-en.svg"),width:960,height:720,
      title:T("视频链路：音频、画面与证据状态分别处理", "Video: process audio, visuals and evidence status separately"),
      note:T("集成 Video2Skill_Invest：转录与视觉处理分路执行，WhisperX 提供本地时间对齐，PPT/OCR 与页面身份解决画面证据定位。DeepSeek 仅接收经授权的文字；必需截图在本地复核，文字和视觉覆盖各有回执", "Integrated with Video2Skill_Invest: transcription and visual work use separate routes. WhisperX aligns timestamps locally, while slide OCR and page identity locate visual evidence. DeepSeek receives authorized text only; required screenshots are reviewed locally, with separate text and visual receipts")},
    {label:"WRITE VERIFICATION",src:T("assets/wiki/verification-zh.svg","assets/wiki/verification-en.svg"),width:960,height:460,
      title:T("页面批准、并发保护与写后验收", "Page approval, concurrency checks and post-write verification"),
      note:T("批准绑定精确页面 ID、草稿和基线。写入者在共享锁内检查当前版本及 expected-old hash；独立验证器核对实际页面、唯一索引登记、追加日志和原始来源，并生成不可覆盖的回执", "Approval binds exact page IDs, drafts and baseline. The writer checks live state and expected-old hashes under a shared lock. A separate verifier checks actual pages, unique index registration, appended logs and original sources, then emits a non-overwriting receipt")}
  ],
  outputs:[
    {title:T("可追溯上下文", "Traceable context"),body:T("来源定位、证据等级和覆盖状态随检索包交付", "Retrieval packages carry source locators, evidence classes and coverage")},
    {title:T("多模态派生产物", "Multimodal artifacts"),body:T("文档结构、视频时间线、PPT/OCR 与视觉复核记录", "Document structure, video timeline, slide OCR and visual-review records")},
    {title:T("可核对的完成条件", "Checkable completion"),body:T("批准范围、实际文件及独立回执共同确认更新", "Approved scope, actual files and an independent receipt confirm updates")}
  ],
  table:{title:T("各层产物与验收条件", "Artifacts and acceptance conditions by layer"),highlight:false,
    headers:[T("检查维度", "Check"),T("产物", "Artifact"),T("完成条件", "Acceptance condition")],groups:[{rows:[
      [T("来源完整性", "Source integrity"),T("来源审计与媒体 / 文档信息", "Source audit and media/document metadata"),T("原始字节与哈希保持一致，所有派生定位回到同一来源", "Original bytes and hashes remain consistent; all derived locators refer to the same source")],
      [T("文字与时间对齐", "Text and time alignment"),"timeline.json / ASR receipts",T("保留原始片段、字词时间戳、实际转录与对齐提供方，以及需复核的边界", "Preserve original segments, word times, actual text/alignment providers and flagged boundaries")],
      [T("画面与视觉覆盖", "Visual coverage"),"visual_review.json / screenshot receipts",T("每个必需截图都有哈希绑定的本地复核记录，partial 与 unavailable 按实际状态保留", "Every required screenshot has a hash-bound local review record; retain actual partial/unavailable states")],
      [T("论断与证据归属", "Claims and attribution"),T("原子论断 ledger、核验 receipts 与覆盖 manifest", "Atomic-claim ledger, verification receipts and coverage manifest"),T("核对原始陈述、外部支持、冲突与证据等级，明确未覆盖范围", "Check source statements, external support, contradictions and evidence classes; identify coverage gaps")],
      [T("正式页面写入", "Canonical writes"),T("基线、获批页面、索引 / 日志与 Phase 2 回执", "Baseline, approved pages, index/log and Phase 2 receipt"),T("最终文件匹配获批草稿，无额外页面改动；索引唯一、日志只追加、原始来源不变", "Live files match approved drafts with no extra page edits; unique index entries, append-only logs and unchanged sources")]
    ]}]},
  evidenceNote:T("实现说明依据所指定仓库的技术文档与脚本核对。页面展示流程、产物和检查条件；具体视频与文档的处理覆盖状态以各次运行回执为准", "Implementation descriptions were checked against the specified repository’s documentation and scripts. This page presents workflows, artifacts and acceptance conditions; per-source coverage is recorded in each run’s receipts")
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
    "src": {"zh":"assets/wiki/architecture-zh.svg","en":"assets/wiki/architecture-en.svg"},
    "width":960,"height":540
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
    "src": "assets/review/figure-1-forecast.png", "width": 1578, "height": 1122
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
const productGrowthABResults = {
  headers:[T("线上实验","Online phase"),T("建议采纳率","Adoption"),T("GMV 增幅比较","GMV growth comparison")],
  rows:[
    [T("第一期","Phase 1"),"26.6%",T("较该期对照组高 65.2%","65.2% higher than that phase’s control")],
    [T("第二期","Phase 2"),"39.3%",T("较该期对照组高 27.7%","27.7% higher than that phase’s control")],
  ],
  note:T("两期数字为各自对照组下的项目整体效果，不合并，也不单独归因于 Agent 的某个模块", "Each phase reports overall project results against its own control. The phases are not combined or attributed to a single agent component"),
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
    perspective: T("浏览视角", "Portfolio perspective"),
    experienceView: T("经历视角", "Experience"),
    technologyView: T("AI 技术视角", "AI technology"),
    technologyNav: T("技术", "Technology"),
    technologyTitle: T("从 AI 技术，看我的实践", "My work through AI technology"),
    technologyDesc: T("从深度学习、图学习与 Transformer，到大模型适配、可靠推理和 Agent，连接技术方法与具体工作", "From deep learning, graphs and Transformers to LLM adaptation, reliable inference and agents: methods connected to the work I did"),
    technologyRoute: T("选择技术方向，查看对应实践", "Choose a technical area to explore my work"),
    technologyProblem: T("解决的问题", "The problem"),
    technologyContribution: T("我做的事情", "My work"),
    technologyEvidence: T("验证与结果", "Evidence & results"),
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
  technologies:[
    {
      id:"tech-deep-learning",name:"Deep Learning",icon:"forecast",
      title:T("时序建模与不确定性预测", "Temporal modeling & uncertainty"),
      problem:T("日前电价同时受时间依赖与特征变化影响，业务还需要知道预测的不确定性", "Day-ahead electricity prices depend on temporal patterns and changing features, and forecasts also need to express uncertainty"),
      contribution:T("构建 ARUCNN–GRU 与 Dense Skip Attention 框架，结合非权重共享卷积、循环网络与特征轴注意力；通过 MAE 和平滑分位损失分别支持点预测与区间预测", "Built an ARUCNN–GRU and Dense Skip Attention framework with unshared convolution, recurrent modeling and feature-axis attention. MAE and smooth quantile losses support point and interval forecasts"),
      evidence:T("在瑞典、挪威、丹麦、芬兰数据上开展离线对照；分别检查点预测误差、区间质量与计算资源。成果发表于 IEEE Transactions on Power Systems", "Offline comparisons across Sweden, Norway, Denmark and Finland assess point error, interval quality and computational resources. Published in IEEE Transactions on Power Systems"),
      tags:["CNN","GRU","Attention","Quantile Regression"],
      links:[{target:"project-hust-price",label:T("日前电价点预测与区间预测", "Point & interval electricity-price forecasts")}],
    },
    {
      id:"tech-graph-learning",name:"Graph & Federated Learning",icon:"graph",
      title:T("学习跨场站关系，保留本地差异", "Learn cross-site relations, retain local differences"),
      problem:T("多风电场存在数据孤岛、空间依赖和不同的时间模式，原始数据需要留在各场站", "Wind farms have isolated data, spatial dependence and different temporal patterns, while raw data needs to remain at each site"),
      contribution:T("用 SiDGI 学习有向特征图，并通过 GAT 校准边权；在 CPLF 中共享空间参数，保留本地时间模型，实现个性化联邦预测", "Used SiDGI to learn directed feature graphs and GAT to calibrate edge weights. CPLF shares spatial parameters while retaining local temporal models for personalized federated forecasting"),
      evidence:T("通过集中式、联邦及本地基线对照和图模块消融检验方案，评估预测表现与通信开销；论文共同第一作者，发表于 IEEE Transactions on Network Science and Engineering", "Evaluated forecasting and communication through centralized, federated and local comparisons plus graph ablations. Co-first author in IEEE Transactions on Network Science and Engineering"),
      tags:["SiDGI","GAT","CPLF","Personalization"],
      links:[{target:"project-hust-wind",label:T("FedGIN / CPLF 多风电场预测", "FedGIN / CPLF wind-power forecasting")}],
    },
    {
      id:"tech-transformer",name:"Transformer",icon:"scope",
      title:T("诊断并缓解时序表征的秩坍缩", "Diagnose & mitigate rank collapse"),
      problem:T("强自相关输入容易让注意力退化、Token 表征趋同，影响销量预测的泛化", "Strong input autocorrelation can degrade attention and homogenize token representations, limiting sales-forecast generalization"),
      contribution:T("从注意力稳定秩与 Token 相似度开展机制诊断；提出 DEFormer，融合原序列与一阶差分，并以 log-return 目标和 MMoE 回归／分类双任务训练缓解自回归依赖", "Diagnosed attention stable rank and token similarity. Proposed DEFormer with raw/differenced inputs, log-return targets and MMoE regression/classification training to reduce autoregressive dependence"),
      metrics:[{value:"−12.7% / −5.6%",label:T("两数据集 wMAPE · 相对 PatchTST", "wMAPE on two datasets · vs. PatchTST")}],
      evidence:T("离线结果覆盖约 4,500 / 9,000 件商品，并通过模块消融和跨层表征分析验证；论文已投稿", "Offline results cover about 4,500 / 9,000 products, with module ablations and layer-wise representation analysis. Manuscript submitted"),
      tags:["PatchTST","Tokenization","MMoE","Ablation"],
      links:[{target:"project-deformer",label:T("DEFormer 机制研究与实验", "DEFormer mechanisms & experiments")}],
    },
    {
      id:"tech-llm",name:"LLM Representations",icon:"local",
      title:T("把大模型条件表征接入销量预测", "Bring LLM representations into sales forecasting"),
      problem:T("时序模型需要理解商品、营销条件与价格信息，并把这些条件用于销量预测", "A temporal forecaster needs product, promotion and price context to inform sales predictions"),
      contribution:T("用冻结的 Qwen3-4B 编码商品信息、营销条件、价格与历史销量，经门控融合接入时序表征，并在下游预测任务中验证效果", "Encoded product information, promotion conditions, prices and sales history with frozen Qwen3-4B; used gated fusion with temporal representations and validated downstream forecasting"),
      metrics:[{value:"−2.1%",label:T("离线 wMAPE · 相对同配置、无 Qwen3 表征", "Offline wMAPE · vs. same setup without Qwen3")}],
      evidence:T("比较保持预测模型配置一致，衡量的是条件表征接入后的预测改善", "The comparison keeps the forecaster configuration fixed and measures the forecasting gain from conditional representations"),
      tags:["Qwen3-4B","Frozen Features","Gated Fusion"],
      links:[{target:"project-qwen",label:T("Qwen3 表征与销量预测", "Qwen3 representations & sales forecasts")}],
    },
    {
      id:"tech-post-training",name:"LLM Post-training",icon:"decision",
      title:T("从任务适配，到下游预测验证", "Task adaptation validated downstream"),
      problem:T("大模型在销量变化标签任务上的提升，需要进一步在真实预测任务中成立", "Improvement on sales-change labels needs to translate into better downstream forecasts"),
      contribution:T("基于六类销量变化标签开展 LoRA SFT；从同一 SFT 基线分别评估 GRPO 的可验证奖励强化学习与 OPD 概率蒸馏。每条路线接入表征后重新训练下游预测器", "Applied LoRA SFT to six sales-change labels, then evaluated GRPO with verifiable rewards and OPD probability distillation from the same SFT baseline. Retrained the downstream forecaster for each representation route"),
      metrics:[
        {value:"−3.7%",label:T("SFT · 相对冻结表征", "SFT · vs. frozen features")},
        {value:"−2.9%",label:T("RLVR · 相对 SFT", "RLVR · vs. SFT")},
        {value:"−3.1%",label:T("OPD · 相对 SFT", "OPD · vs. SFT")},
      ],
      evidence:T("以上为离线 wMAPE 相对降幅；各自使用注明的基线，两条后训练路线分别评估，降幅不叠加", "Figures are relative offline wMAPE reductions against their stated baselines. The two post-training routes are evaluated separately; gains are not additive"),
      tags:["LoRA SFT","RLVR / GRPO","On-Policy Distillation"],
      links:[{target:"project-qwen",label:T("SFT、RLVR 与 OPD 对照", "SFT, RLVR & OPD comparisons")}],
    },
    {
      id:"tech-inference",name:"Reliable Inference",icon:"execute",
      title:T("让线上预测更稳定", "Make predictions more stable in use"),
      problem:T("同一样本跨批次预测不一致，相近输入的预测变化过大", "The same sample gives inconsistent predictions across batches, and similar inputs produce overly sensitive outputs"),
      contribution:T("引入 Monte Carlo Dropout 多次随机采样与均值聚合，通过逐样本跨批次变异系数和受控输入扰动评估稳定性", "Introduced repeated Monte Carlo Dropout samples with mean aggregation, evaluating per-sample cross-batch variation and controlled input perturbations"),
      metrics:[
        {value:"−11%",label:T("跨批次预测 CV", "Cross-batch prediction CV")},
        {value:"−10%",label:T("输入扰动敏感性", "Input sensitivity")},
      ],
      evidence:T("相对原线上推理方案的稳定性改善；两项指标均衡量输出稳定性", "Stability improvements relative to the original online inference approach. Both metrics measure output stability"),
      tags:["Monte Carlo Dropout","Sampling","Stability"],
      links:[{target:"project-qwen",label:T("线上推理优化与评估", "Inference optimization & evaluation")}],
    },
    {
      id:"tech-agent",name:"Agent Systems",icon:"memory",
      title:T("把预测、决策与反馈接成运营闭环", "Connect forecasts, decisions & feedback"),
      problem:T("高潜商品孵化与成长层级维持需要差异化方案，还需要持续利用历史运营反馈", "Product incubation and growth-tier retention need different interventions and continuing use of operating feedback"),
      contribution:T("封装价量预测工具，结合营销、广告和搜索曝光信号评估商品；串联运营决策、执行反馈与跨轮次记忆，并实现重试、回退和人工审核", "Wrapped the price–sales forecaster as a tool, assessed products with marketing, advertising and search signals, and connected operating decisions, feedback and cross-round memory with retries, fallbacks and human review"),
      resultTable:productGrowthABResults,
      tags:["Tool Calling","Workflow","Memory","Human Review"],
      links:[{target:"project-agent",label:T("高潜商品孵化与防滑落 Agent", "Agent for product growth & tier retention")}],
    },
    {
      id:"tech-knowledge",name:"Evidence & Knowledge Workflows",icon:"scope",
      title:T("让多模态资料与知识更新可追溯", "Trace multimodal evidence & knowledge updates"),
      problem:T("投研资料来自文档、视频等多种来源，需要保留出处、不确定性，并可靠地更新知识页", "Investment research draws on documents and videos; provenance, uncertainty and reliable knowledge-page updates need to be retained"),
      contribution:T("独立开发 AITradingWiki，集成文档与视频入库、来源定位和有界检索；以页面级审批、基线检查和独立写后验证管理知识更新，并结合研究经理反馈迭代工作流", "Independently built AITradingWiki with document/video ingestion, source locators and bounded retrieval. Page-level approval, baseline checks and independent post-write verification manage updates, with research-manager feedback informing iteration"),
      evidence:T("将原始来源、派生内容与正式知识页分别管理；检索保留证据定位，知识更新经独立验证回执后判定完成", "Original sources, derived content and canonical pages remain distinct. Retrieval keeps evidence locators, and independent verification receipts determine when updates are complete"),
      tags:["Multimodal","Bounded Retrieval","Provenance","Verification"],
      links:[{target:"project-wiki",label:T("AITradingWiki 证据工作流", "AITradingWiki evidence workflow")}],
    },
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
        journey:{
          label:T("时间跨度与决策范围的延伸", "A wider time horizon and decision scope"),
          stages:[
            {target:"ali-short-term",number:"01",horizon:T("单个档期 · 未来 14 天", "One campaign · Next 14 days"),title:T("短期 GMV 最大化", "Maximize near-term GMV"),action:T("不同价格下的未来 14 天逐日销量预测", "Daily sales forecasts over the next 14 days at different prices"),diagram:"price"},
            {target:"ali-long-term",number:"02",horizon:T("跨营销周期 · 持续迭代", "Across cycles · Ongoing iteration"),title:T("长期商品成长", "Long-term product growth"),action:T("高潜孵化 · 成长层级防滑落", "Incubation · Growth-tier retention"),diagram:"growth"}
          ],
          connection:T("预测能力复用", "Reuse the forecasting capability"),
          detail:T("优化后的价量预测模型，成为长期成长项目的 baseline", "The improved price–sales forecaster becomes the baseline for longer-term growth planning")
        },
        goalLabel:T("业务目标", "Objective"),
        contributionLabel:T("我的贡献", "My contribution"),
        phases:[
          {
            id:"ali-short-term",number:"01",
            horizon:T("单个营销周期 · 以未来 14 天为例", "One marketing cycle · e.g. the next 14 days"),
            title:T("提升预测质量，支持短期 GMV 最大化", "Better forecasts for single-cycle GMV optimization"),
            goal:T("对每个候选价格，预测未来 14 天的每日销量，输出 14 维预测序列；在决策环节，将 14 个日预测值求和后乘以价格，比较预测 GMV，为当期 GMV 最大化定价提供依据", "For each candidate price, output a 14-dimensional sequence of daily sales forecasts. At the decision stage, sum the 14 daily predictions and multiply by price, then compare predicted GMV to inform pricing that maximizes GMV within the cycle"),
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
            resultTable:productGrowthABResults,
            links:[{target:"project-agent",label:T("高潜商品孵化与防滑落", "Product growth & retention"), action:T("复用预测 baseline，结合商品状态与历史反馈，串联评估、运营建议与持续迭代", "Reused the forecasting baseline with product state and feedback in an ongoing assessment and recommendation workflow")}],
          },
        ],
        bridgeLabel:T("复用预测能力，扩大决策跨度", "Reuse forecasting across a wider horizon"),
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
            previewLabel:T("智能戒指产品实践", "Smart-ring product work"),
            horizon:T("智能硬件 · 从概念到首代样机", "Smart hardware · Concept to first prototype"),
            title:T("智能戒指：需求定义、样机验证与交付", "Smart ring: requirements, prototype validation and delivery"),
            goal:T("围绕健康监测需求，结合用户优先级与工程约束定义首代产品，并将真实使用反馈用于迭代与交付", "Define a first-generation product around health-monitoring needs, user priorities and engineering constraints, then use real feedback to guide iteration and delivery"),
            links:[{target:"project-ring",label:T("智能戒指产品开发", "Smart-ring product development"),action:T("开展 200+ 用户访谈，规划功能与原型并评估工程可行性；建立 200+ 天使用户社群，组织样机测试与反馈，协调研发与运营推进交付", "Conducted 200+ interviews, planned features and prototypes, and assessed engineering feasibility; built a 200+ early-adopter community, organized testing and feedback, and coordinated engineering and operations toward delivery")}],
            result:T("半年内核心里程碑 · 种子轮投资", "Core milestones within six months · Seed funding"),
            resultNote:T("团队完成交付，项目获得孵化器投资；我的贡献涵盖需求定义、用户验证与资源协调", "Team-level delivery and incubator funding; my contribution covered requirements, user validation and resource coordination"),
          },
        ],
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
            {target:"project-hust-review",label:T("新能源系统 AI 方法综述", "AI for renewable power operations"),action:T("梳理预测、调度、控制与电力市场中的 AI 方法，独立完成相关章节的文献研究、英文写作与修订", "Reviewed AI across forecasting, dispatch, control and electricity markets, independently researching, writing and revising the relevant sections")},
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
          id:"hust-review",title:T("新能源电力系统运行的 AI 方法综述", "AI methods for renewable power system operation"),
          brief:T("围绕预测、调度、控制与电力市场四类运行任务，对照机器学习、深度学习和强化学习的关键机制、适用条件与研究挑战", "A review of machine learning, deep learning and reinforcement learning across forecasts, dispatch, control and electricity markets, comparing mechanisms, applicability and research challenges"),
          problem:T("高比例新能源带来发电波动、供需失衡及电压和频率变化，并增加资源调度与市场交互的复杂性。综述需要将方法能力、运行目标、物理约束与计算代价联系起来，解释不同 AI 路线的适用范围", "High renewable penetration brings generation variability, supply–demand imbalance and voltage/frequency changes, while complicating resource dispatch and market interactions. The review connects model capabilities with operational objectives, physical constraints and computation to explain where different AI approaches apply"),
          actions:[
            T("围绕新能源发电、负荷和电价预测，梳理 SVR、CNN / TCN、GRU 与 Transformer / Informer 的建模机制，以及精度、预测窗和计算开销之间的取舍。个人贡献包括相关章节的文献研究、英文写作与修订", "Reviewed mechanisms for forecasting renewable generation, demand and electricity prices using SVR, CNN/TCN, GRU and Transformer/Informer, including trade-offs among accuracy, forecast horizon and computation. My contribution included literature research, writing and revision of the relevant sections"),
            T("论文将调度细分为最优潮流、经济调度与机组组合，对照 ML / DL 的候选解生成和端到端估计，以及强化学习的策略优化；讨论发电、储能、可调负荷在运行成本与安全约束下的协同", "The paper separates dispatch into optimal power flow, economic dispatch and unit commitment, comparing ML/DL candidate generation and end-to-end estimation with RL policy optimization. It discusses coordination of generation, storage and flexible loads under cost and security constraints"),
            T("控制部分按监测、建模与控制器组织方法，覆盖发电、输配电、需求及储能子系统；区分 DQN 的离散动作与 DDPG 的连续动作适配，并讨论实时性、环境变化和物理稳定性的约束", "The control section organizes methods into monitoring, modeling and controllers across generation, transmission/distribution, demand and storage. It distinguishes DQN’s discrete-action setting from DDPG’s continuous-action setting and discusses timeliness, environmental change and physical stability"),
            T("市场部分区分批发与零售场景，比较单智能体和多智能体强化学习的竞价与交易机制；结合 Table 1 梳理方法边界，并在 Outlook 中讨论联邦与图学习、多形态储能的 Meta-RL，以及可解释市场决策等未来方向", "The market section distinguishes wholesale and retail settings and compares single- and multi-agent RL for bidding and trading. Table 1 synthesizes applicability; the Outlook discusses federated/graph learning, meta-RL for diverse storage and interpretable market decisions as future directions")
          ],
          result:T("综述形成预测、调度、控制与电力市场四类任务的系统框架，以 Figures 1–4 展示典型机制，Table 1 归纳方法目标、特征和适用条件。论文发表于 Nature Reviews Electrical Engineering（2024），本人为第二作者；贡献声明列出本人参与资料研究、论文写作与投稿前修订", "The review provides a framework across forecasts, dispatch, control and electricity markets. Figures 1–4 illustrate typical mechanisms; Table 1 synthesizes objectives, features and applicability. Published in Nature Reviews Electrical Engineering (2024), with me as second author; the contribution statement records my participation in research, writing and pre-submission revision"),
          takeaway:T("综述训练了我把具体模型放回问题背景中的能力：先说明预测对象与用途，再解释方法的适用条件和局限", "Review work trained me to place a model in context: explain the forecasting target and its use, then the method’s applicability and limitations"),
          stack:[T("文献研究","Literature Review"),T("新能源系统","Renewable Power"),"ML / DL / RL",T("方法适用性","Method Applicability"),T("英文科研写作","Scientific Writing")],
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
      table:productGrowthABResults,
      outcome:T("完成商品评估、运营决策、执行反馈与记忆更新的流程串联，并结合人工审核支持建议使用。项目通过两期线上 A/B 实验观察建议采纳与业务效果", "The implementation connected product assessment, operating decisions, execution feedback and memory updates, with human review supporting recommendations. Two online A/B phases evaluated adoption and business outcomes at project level"),
      learning:T("我在这里的思考是：Agent 的工程价值需要体现在业务流程中。预测依据、历史反馈、失败处理和审核环节必须各自清晰，联合模型也需要在真实样本上验证结构假设", "My takeaway is that an agent’s engineering value must show up in the operating workflow. Forecasting evidence, historical feedback, failure handling and review each need a clear role; joint models also need real-sample validation of their structural assumptions"),
      tags:["Tool Calling","Workflow","Memory","Human Review","GMV(B,P)"],
      visualStory:"ali-agent",related:"ali-long-term",
    },
    {
      id:"project-wiki",index:"02",category:T("个人项目 · 多模态知识工程", "Independent project · Multimodal knowledge engineering"),
      title:T("AITradingWiki", "AITradingWiki"),
      description:T("将文档与视频转为带来源定位的研究页面，串联多模态摄入、有界检索、具名审批与写后验证", "Turn documents and videos into locator-bound research pages through multimodal ingestion, bounded retrieval, exact-page approval and post-write verification"),
      role:T("独立开发者 · 需求定义、Codex Skills 与 Python 工具编排、视频桥接、完整性验证", "Independent developer · Requirements, Codex Skills and Python orchestration, video integration and integrity checks"),
      context:T("投资研究资料分散在 PDF、Office 文档、长视频和历史研究页面中。项目以 Codex 调用 Skills 和确定性 Python 工具组织证据处理，并以 Obsidian 浏览 Markdown 知识页、链接和图谱，让后续研究能够追溯到原文、视频时间点与画面，同时保留观点归属和未覆盖范围", "Investment research spans PDFs, Office files, long videos and existing research pages. Codex invokes Skills and deterministic Python tools to process evidence, while Obsidian browses Markdown pages, links and graphs. Subsequent research can trace claims to source text, video times and visuals while retaining attribution and coverage gaps"),
      challenge:T("文档结构、音频转录与幻灯片需要不同的预处理和定位方式；ASR、OCR 和模型整理的证据状态也需要分别记录。视频涉及音频和派生文字的独立传输授权，知识更新涉及精确批准范围、并发编辑与写入完成验证。资料规模增长时，还需要控制每次检索进入上下文的内容量", "Document structure, audio transcripts and slides need different preprocessing and locators, with separate evidence states for ASR, OCR and model refinement. Video introduces independent authorization for audio and derived-text transfers; knowledge updates require exact approval scope, concurrency checks and completion verification. Retrieval must also control context size as the collection grows"),
      visualStory:"wiki-system",wikiStudy:wikiStudy,
      decisions:[
        {title:T("Codex 原生编排与分层存储", "Codex-native orchestration and layered storage"),
          body:T("以 AGENTS、按任务加载的 Skills 和 Python 脚本组织摄入、查询、核验和研究工作流。raw 保存原始证据，output 保存可重建的报告、时间线和审计产物，wiki 保存 Source、Entity、Concept、Event、Model、Synthesis 六类正式页面；来源、解释、日期变化与模型假设分别归属，Obsidian 提供反链和图谱浏览", "AGENTS, task-loaded Skills and Python scripts organize ingestion, queries, checks and research. raw holds original evidence, output holds rebuildable reports, timelines and audit artifacts, and wiki holds six Canonical page types: Source, Entity, Concept, Event, Model and Synthesis. Source statements, interpretation, dated changes and model assumptions have separate roles; Obsidian provides backlinks and graph browsing")},
        {title:T("原生文档按对象定位与覆盖核对", "Locate native-document objects and check coverage"),
          body:T("本地预处理器支持 PDF、PPTX、DOCX 和 XLSX：PDF 保留页与图片 / 向量区域，PPTX 保留 slide、shape 与表格 / 图表对象，DOCX 使用 part / block 定位，XLSX 保留 sheet / cell 结构。预处理只读原文件，生成结构化 JSON、Markdown 和派生资产；文本提取、OCR 需求、视觉复核与转换覆盖分别标记，待复核对象保留定位信息", "Local preprocessing supports PDF, PPTX, DOCX and XLSX: page and image/vector regions for PDFs; slides, shapes and table/chart objects for PPTX; part/block locators for DOCX; and sheet/cell structure for XLSX. It reads sources without altering them and emits structured JSON, Markdown and derived assets. Text extraction, OCR needs, visual review and conversion coverage are recorded separately, with locators retained for pending objects")},
        {title:T("视频音频路由：Gemini / Qwen3-ASR + WhisperX", "Video audio routing: Gemini / Qwen3-ASR + WhisperX"),
          body:T("通过 Video2Skill_Invest 桥接单视频生产任务，预检源哈希、媒体信息、依赖和锁定配置。用户选择经授权的 Gemini 3.5 Transcribe 音频分块或本地 Qwen3-ASR；Gemini 提供转录文字，本地 WhisperX 从 PCM 音频生成字词时间戳。Gemini 文字对齐采用最长 120 秒的非重叠窗口与有界声学计算，另行处理本地说话人分段，并保留实际提供方、模型身份及需复核的文字 / 时间边界", "A Video2Skill_Invest bridge runs one-video production jobs after checking source hash, media metadata, dependencies and pinned configuration. The user selects authorized Gemini 3.5 Transcribe audio chunks or local Qwen3-ASR. Gemini supplies text; local WhisperX generates word times from PCM audio. Gemini text alignment uses non-overlapping windows of at most 120 seconds with bounded acoustic computation, alongside separate local speaker processing. Actual providers, model identity and flagged text/time boundaries are retained")},
        {title:T("失败分类、远端清理与完整音频回退", "Failure classification, remote cleanup and full-audio fallback"),
          body:T("鉴权、限额、服务、网络中断、无效响应和对齐失败使用明确 reason code。普通 Gemini 失败后，先确认每个远端音频对象已删除，再以本地 Qwen3-ASR 重转完整原始音频，不拼接成功的 Gemini 分块；转录 POST 不自动重试。上传或清理结果不明时保持 upload_uncertain 并停止回退，留下可审计的失败与清理记录", "Authentication, quota, service, network, response-validation and alignment failures have explicit reason codes. After ordinary Gemini failures, remote audio deletion must be confirmed before Qwen3-ASR retranscribes the complete original audio; successful Gemini chunks are not spliced into fallback. Transcription POSTs are not retried automatically. Ambiguous upload/cleanup remains upload_uncertain and blocks fallback, retaining failure and cleanup records")},
        {title:T("PPT 身份、OCR 与本地截图复核", "Slide identity, OCR and local screenshot review"),
          body:T("视觉链路检测 PPT 变化、选择关键帧并解析页面身份；每个主关键帧执行通用 OCR，规范页面去重后只对其代表执行 PP-Structure / ChartParsing。重复页和回访帧保留通用 OCR 及显式结构处理状态。高召回分类器将图表、公式、复杂视觉与不确定页面加入必需截图队列，按 canonical page、出现次数、时间点和图像哈希进行本地复核，并单独记录 reviewed、partial 或 unavailable", "The visual route detects slide changes, selects keyframes and resolves page identity. General OCR covers each primary keyframe; PP-Structure/ChartParsing runs on representatives after canonical-page deduplication. Duplicate and revisit frames retain general OCR and explicit structure-processing states. A high-recall classifier queues charts, formulas, complex visuals and uncertain pages for local review, bound to page identity, occurrences, timestamps and image hashes, with reviewed, partial or unavailable recorded separately")},
        {title:T("文字整理保持时间线与原始证据可追溯", "Refine text while retaining timeline provenance"),
          body:T("DeepSeek 在独立文字传输授权后，仅接收转录和相关 PPT OCR 文字。相邻片段按说话人、视觉上下文、停顿、时长与字符预算安全组合，使用 OpenCC 规范派生显示为简体中文；原始 ASR / OCR JSON、source segment 和字词时间戳保持不变。时间线 JSON、原始及整理后的 HTML、视觉报告和 manifest 分别保留，模型整理继续作为派生证据", "After separate text-transfer authorization, DeepSeek receives only transcripts and related slide OCR text. Adjacent fragments are grouped under speaker, visual-context, pause, duration and character-budget gates; OpenCC normalizes derived display to Simplified Chinese. Raw ASR/OCR JSON, source segments and word times remain unchanged. Timeline JSON, original/refined HTML, visual reports and manifest are retained separately, and model refinement remains derived evidence")},
        {title:T("有界检索：先候选，再目录与章节", "Bounded retrieval: candidates, outlines and sections"),
          body:T("标准库检索器按唯一身份、元数据、别名、标题和页面类型筛选候选，再读取目录与目标章节。默认每轮最多 20 个候选、manifest 不超过 64 KiB；每批最多 6 页或章节、总计 36,000 字符，超过 12,000 字符的大页先读结构。索引缓存绑定内容快照，next_offset 续读必须保持查询与快照身份，证据包继续携带来源定位、不确定性、反证和缺口", "A standard-library retriever selects candidates through resolved identity, metadata, aliases, titles and page type, then reads outlines and relevant sections. Defaults are at most 20 candidates and a 64 KiB manifest; each batch reads up to 6 pages/sections and 36,000 characters, with structure first for pages over 12,000 characters. Cache identity binds the content snapshot; next_offset continuation preserves query and snapshot identity. Evidence packages retain provenance, uncertainty, counter-evidence and gaps")},
        {title:T("原子论断、证据分类与外部核验分开记录", "Record atomic claims, evidence classes and external checks"),
          body:T("Phase 1 将重要论断绑定到来源文件、页面或时间点，并记录事实、公司陈述、观点、模型假设与推断等证据类型。原始来源陈述与外部核验分别归属，ledger、逐条 receipt 和覆盖 manifest 记录支持、冲突及未覆盖部分。页面草稿和依赖闭包以具名 ID 提交预览，证据不足的对象保持 partial 或 unavailable，来源可读与事实核验分别检查", "Phase 1 binds material claims to source files, pages or times and records evidence classes such as facts, company statements, opinions, model assumptions and inferences. Source statements and external checks have separate attribution; a ledger, per-claim receipts and coverage manifest record support, contradictions and gaps. Named page IDs and dependency closure are previewed, while insufficiently covered objects remain partial or unavailable. Source readability and factual verification have separate checks")},
        {title:T("精确批准、共享锁与独立写后回执", "Exact approval, shared lock and independent write receipt"),
          body:T("Phase 2 准备绑定来源、当前 Wiki、草稿和依赖的基线，批准仅覆盖精确页面 ID 与对应正文。写入者在共享锁内重新检查基线和 expected-old hash，逐文件原子写入获批页面、更新唯一索引登记并追加日志。独立验证器再核对实际文件与获批草稿、无额外页面改动、日志历史和原始来源，生成单独回执；发生冲突或多文件中途失败时报告实际进度并保留已完成的独立写入", "Phase 2 prepares a baseline binding sources, current Wiki, drafts and dependencies; approval covers exact page IDs and their text. Under a shared lock, the writer rechecks baseline and expected-old hashes, atomically writes approved files, updates unique index entries and appends the log. A separate verifier checks actual files against drafts, extra edits, log history and source integrity before emitting a receipt. Conflicts or mid-run multi-file failures report actual progress and preserve completed independent writes")},
        {title:T("可复现部署与私有知识核心共享", "Reproducible setup and private knowledge-core sharing"),
          body:T("团队仓库共享 Canonical Markdown、Skills、模板、脚本和测试；raw、output、密钥、模型权重和本地缓存保持独立。幂等 setup 保留已有证据与页面，视频工具和本地模型按固定版本配置，隔离运行环境避免污染核心依赖。私有推送检查、干净克隆验收与视频回退、视觉复核、检索和 Phase 2 等测试入口覆盖对应边界，团队可获得一致的知识核心与工具定义", "The team repository shares Canonical Markdown, Skills, templates, scripts and tests; raw evidence, outputs, secrets, model weights and caches remain separate. Idempotent setup preserves evidence and pages, video tools/models use pinned configurations, and isolated environments protect core dependencies. Private-push checks, clean-clone acceptance and tests for fallback, visual review, retrieval and Phase 2 cover those boundaries, giving teammates a consistent knowledge core and tool definitions")}
      ],
      outcome:T("独立构建了从文档与视频到研究页面的可追溯工作流：集成原生文档预处理和 Video2Skill 多模态链路，用有界检索交付问题相关上下文，以原子论断和证据分类保留来源归属，并将知识更新完成条件落实为精确批准范围、实际文件核对与独立写后回执。项目继续结合投资研究经理反馈完善需求", "I built a traceable workflow from documents and videos to research pages: native-document preprocessing and Video2Skill integration, bounded context retrieval, atomic claims and evidence classes, and explicit completion criteria tied to exact approval scope, actual files and an independent post-write receipt. Requirements continue to be refined through investment research managers’ feedback"),
      tags:["Codex","Python","Video2Skill","Qwen3-ASR","WhisperX","Gemini","DeepSeek","PPT / OCR",T("有界检索","Bounded Retrieval"),T("页面审批","Page Approval"),T("写后验证","Post-write Verification")],
    },
    {
      id:"project-qwen",index:"03",category:T("大模型 × 时序预测", "LLMs × Time-series forecasting"),
      title:T("Qwen3 增强的销量预测与推理优化", "Qwen3-enhanced forecasting & inference"),
      description:T("从条件表征到后训练，再分别评估预测精度与推理稳定性", "From conditional representations to post-training, with separate accuracy and stability evaluation"),
      role:T("阿里营销算法团队 · 表征融合、后训练实验、下游预测与推理优化", "Alibaba Marketing Algorithms Team · Representation fusion, post-training, downstream forecasting and inference"),
      context:T("这条优化路线服务于短期价量预测：在未来一个营销周期（如 14 天）内，预估不同价格下每天的销量，为 GMV 优化提供依据。围绕历史数值、商品与营销条件，将 Qwen3 表征与时序模型结合，验证后训练对下游预测的收益，并单独优化线上输出稳定性", "This optimization track supported short-term price–sales forecasting: estimating daily sales at different prices over a future marketing cycle, such as 14 days, to inform GMV optimization. It combined Qwen3 representations of product and marketing context with temporal signals, evaluated post-training in downstream forecasting, and separately improved inference stability"),
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
      description:T("从零售销量预测中的表征趋同出发，连接机制诊断、双端改进与实验验证", "From homogenized retail forecasting representations to mechanism diagnosis, input and training redesign, and experimental validation"),
      role:T("研究主导 · 阿里营销算法团队 · 2025.07 — 2026.07", "Research lead · Alibaba Marketing Algorithms Team · 2025.07 — 2026.07"),
      context:T("面向电商促销定价的销量预测，论文使用 Small（约 4,500 件商品）与 Large（约 9,000 件商品）两个真实零售数据集。每个数据集覆盖三年、按天记录，预测窗固定为未来 14 天；输入包含历史销量、价格、点击 UV、预先确定的未来价格，以及序列化的商品、类目与品牌标识", "For sales forecasting that supports retail promotional pricing, the paper evaluates Small (~4,500 products) and Large (~9,000 products). Each contains three years of daily data with a fixed 14-day forecast horizon. Features include historical sales, prices, click UV, predetermined future prices, and serialized product, group and brand identifiers"),
      challenge:T("销量序列的强自相关，使不同时间位置可能包含相似信息；以历史序列预测未来的连续回归任务，也可能强化对相关模式的依赖。研究问题是：这些因素是否伴随注意力与 Token 表征趋同，能否分别从输入与训练端缓解？", "Strong autocorrelation can make information at different time positions similar. Continuous regression from past to future may reinforce reliance on correlated patterns. The research asks whether these conditions accompany attention and token homogenization, and whether changes to inputs and training can alleviate it"),
      flow:[T("自相关与层深分析","Autocorrelation & depth"),T("稳定秩 / token 相似度","Rank / token similarity"),T("去相关与多任务","Decorrelation & multitask"),T("消融与零售评估","Ablations & retail evaluation")],
      decisions:[
        {
          title:T("使用可观测表征指标进行诊断", "Diagnose with observable representation measures"),
          body:T(String.raw`使用注意力矩阵的稳定秩 \(\rho_{\mathrm{sr}}\) 与 token 平均余弦相似度 \(\rho_{\mathrm{ca}}\)，比较三层网络在初始化、训练后高 ACF 和低 ACF 条件下的表现。高 / 低 ACF 以预测窗内平均 ACF 的 0.5 阈值划分；论文观察到训练可以缓解初始化坍缩，但高 ACF 输入仍更容易出现低稳定秩和高 token 相似度`, String.raw`I used attention stable rank \(\rho_{\mathrm{sr}}\) and mean token cosine similarity \(\rho_{\mathrm{ca}}\) across three layers, comparing initialization with trained high- and low-ACF conditions. The split uses a mean ACF threshold of 0.5 over the forecast horizon. Training can escape initialization collapse, while high-ACF inputs still tend toward lower rank and more similar tokens`),
        },
        {
          title:T("输入端：原序列与差分的双路 Tokenization", "Input: dual-path tokenization of raw values and differences"),
          body:T("直接对原序列做差分会丢失水平信息，因此我保留原序列，并增加一阶差分支路。两路输入分别缩放、进行带符号的对数变换，再经独立线性投影相加，使输入表征同时保留水平与变化信息", "Differencing alone loses level information, so I retain raw values and add a first-difference path. Both paths are scaled, transformed with signed logarithms and independently projected before summation, preserving both levels and changes"),
        },
        {
          title:T("目标与训练端：log-return、MMoE 与双任务监督", "Targets and training: log-return, MMoE and dual-task supervision"),
          body:T("以最后一个历史值为参照，将未来销量转换为对数比值目标，改变直接预测原始销量的任务形态。Transformer 后接 MMoE（多门控专家混合），分别连接连续回归与辅助分类分支；MSE 与 Focal Loss 共同训练，让共享表征同时接受连续与离散监督", "Transform future sales into a log-ratio target relative to the last historical value, changing the task from directly predicting raw sales. MMoE (multi-gate mixture-of-experts) follows the Transformer and feeds regression and auxiliary classification heads; MSE and Focal Loss jointly provide continuous and discrete supervision"),
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
      category:T("研究详解 · 新能源电力系统运行综述", "Research · Renewable power system operation review"),
      title:T("新能源电力系统：AI 预测、调度、控制与市场", "AI for renewable power system operation"),
      role:T("第二作者 · 相关章节文献研究、英文写作与修订", "Second author · Literature research, writing and revision of the relevant sections"),
      context:T("论文以高比例新能源接入带来的不确定性为背景，将预测、调度、控制和电力市场作为四个关键运行环节。综述将 ML、DL 与 RL 方法放入各自任务、决策变量与物理约束中，讨论计算效率、适用条件及后续研究方向", "Against uncertainty from high renewable penetration, the paper identifies forecasts, dispatch, control and electricity markets as four key operational components. It places ML, DL and RL within their tasks, decision variables and physical constraints to discuss computation, applicability and future research"),
      researchStudy:reviewResearchStudy,
      decisionTitles:[T("预测：建模机制与计算取舍", "Forecasts: modeling mechanisms and computation"),T("调度：任务分类与运行约束", "Dispatch: tasks and operational constraints"),T("控制：系统状态与动作空间", "Control: system states and action spaces"),T("市场：多参与者交互与研究展望", "Markets: participant interactions and outlook")],
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
