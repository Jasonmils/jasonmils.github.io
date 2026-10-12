(() => {
  "use strict";
  const data = portfolio;
  const ui = data.ui;
  const experienceStories = data.experience.flatMap(exp => exp.stories);
  const researchProjects = (data.researchProjects || []).map(project => {
    if (!project.sourceStory) return project;
    const story = experienceStories.find(item => item.id === project.sourceStory);
    return {...project,description:story.brief,challenge:story.problem,
      decisions:story.actions.map((body,i) => ({title:project.decisionTitles[i],body})),
      outcome:story.result,learning:story.takeaway,tags:story.stack,visualStory:story.id,related:"hust-research"};
  });
  const projectCatalog = [...data.projects,...researchProjects];
  const escapeHTML = value => String(value).replace(/[&<>"']/g, ch => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;"
  }[ch]));
  const bi = (value, inline = false) => {
    if (typeof value === "string" || typeof value === "number") return escapeHTML(value);
    return '<span class="bi' + (inline ? ' bi-inline' : '') + '"><span class="zh" lang="zh-CN">' +
      escapeHTML(value.zh) + '</span><span class="en" lang="en">' + escapeHTML(value.en) + '</span></span>';
  };
  const arrow = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const diagonal = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></svg>';
  const up = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  const dot = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>';
  const tags = values => '<div class="tag-list">' + values.map(v => '<span class="tag">' + bi(v, true) + '</span>').join('') + '</div>';
  // Reserve space for each complete translated group, so tags stay with their paragraph.
  const experienceOverview = exp => '<div class="experience-overview bi">' + ["zh", "en"].map(lang =>
    '<div class="' + lang + '" lang="' + (lang === "zh" ? "zh-CN" : "en") + '"><p>' +
    escapeHTML(exp.overview[lang]) + '</p>' + tags(exp.focus.map(tag =>
      typeof tag === "object" ? tag[lang] : tag)) + '</div>'
  ).join('') + '</div>';
  const toggle = () => '<span class="detail-toggle"><span class="when-open">' + bi(ui.collapse, true) +
    '</span><span class="when-closed">' + bi(ui.expand, true) + '</span><span class="toggle-plus" aria-hidden="true"><svg class="toggle-chevron" viewBox="0 0 12 12"><path d="m2.5 4.25 3.5 3.5 3.5-3.5"/></svg></span></span>';
  const sectionIds = ["experience","projects","skills","education"];
  const navLinks = (rail = false) => sectionIds.map((id, i) =>
    '<a href="#' + id + '" data-section-link="' + id + '">' +
    (rail ? '<span class="nav-line" aria-hidden="true"></span>' : '') + bi(ui.nav[i], true) + '</a>'
  ).join('');
  const storyBlock = (label, body, cls = "") => '<div class="story-block ' + cls + '"><h4 class="small-label">' + bi(label) +
    '</h4><div>' + body + '</div></div>';
  const diagramIcon = kind => {
    const shapes = {
      forecast: '<path d="M4 18V6m0 12h16M7 14l4-5 4 3 5-8"/>',
      decision: '<path d="M8 4h8v5H8zM5 16h5v5H5zM15 16h5v5h-5zM12 9v4M7.5 16v-3h10v3"/>',
      execute: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
      memory: '<path d="M5 8a8 8 0 1 1-1 9M5 3v5h5M12 7v5l3 2"/>',
      people: '<circle cx="9" cy="8" r="3"/><path d="M3 20v-3a6 6 0 0 1 12 0v3M17 5a3 3 0 0 1 0 6m2 3a5 5 0 0 1 2 4v2"/>',
      scope: '<path d="M6 5h14M6 12h10M6 19h6M2 5h0m0 7h0m0 7h0"/>',
      prototype: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M4 8h16m-11 4h6m-6 4h4"/>',
      graph: '<circle cx="5" cy="7" r="3"/><circle cx="19" cy="5" r="3"/><circle cx="13" cy="19" r="3"/><path d="m8 7 8-2M6 10l5 6m7-8-4 8"/>',
      local: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v13c0 4 16 4 16 0V5M4 11c0 4 16 4 16 0"/>',
      energy: '<path d="m13 2-8 12h6l-1 8 9-13h-7z"/>',
      grid: '<path d="M8 3h8l4 18M8 3 4 21M7 8h10M6 14h12M8 3l10 11M16 3 6 14M6 14l14 7M18 14 4 21"/>',
      home: '<path d="m3 11 9-8 9 8M5 10v11h14V10M10 21v-7h4v7"/>'
    };
    return '<svg class="diagram-icon" viewBox="0 0 24 24" aria-hidden="true">' + shapes[kind] + '</svg>';
  };
  const diagramFlow = (steps, loop, parallel = false) => '<div class="diagram-flow-wrap"><ol class="diagram-flow' +
    (parallel ? ' diagram-parallel' : '') + '" style="--steps:' + steps.length + '">' + steps.map(step =>
      '<li>' + diagramIcon(step[0]) + '<strong>' + bi(step[1]) + '</strong><span class="step-caption">' + bi(step[2]) + '</span></li>'
    ).join('') + '</ol>' + (loop ? '<div class="diagram-return"><span aria-hidden="true">↶</span>' + bi(loop) + '</div>' : '') + '</div>';
  const visualNote = value => '<p class="visual-note">' + bi(value) + '</p>';
  const paperResult = (venue, year, authorship) => '<div class="paper-result"><span class="paper-result-year">' + year +
    '</span><div><strong>' + escapeHTML(venue) + '</strong><span>' + bi(authorship) + '</span></div></div>';
  const visualStories = {
    "ali-agent": {
      tab: T("Agent 闭环", "Agent loop"), title: T("从预测到运营闭环", "From forecasts to an operating loop"),
      challenge: T("让商品状态、运营建议与执行反馈连起来", "Connect product signals, recommendations and operating feedback"),
      render: () => diagramFlow([
        ["forecast", T("预测工具", "Forecast"), T("价量模型", "Price–sales tools")],
        ["decision", T("评估建议", "Assess & plan"), T("潜力 / 保层", "Growth / retention")],
        ["execute", T("执行保障", "Execute"), T("重试 · 人审", "Retry / review")],
        ["memory", T("反馈记忆", "Feedback"), T("记录与检索", "Store / retrieve")]
      ], T("反馈进入记忆 → 支持下一轮判断", "Memory feeds the next round of decisions")) +
        '<div class="visual-section-label">' + bi(T("两期线上 A/B 实验", "Two online A/B phases")) + '</div>' +
        '<div class="ab-results">' + [["01",26.6,65.2],["02",39.3,27.7]].map(([phase,adoption,growth]) =>
          '<div class="ab-phase"><div class="phase-label">' + bi(T("第 " + phase + " 期", "Phase " + phase)) +
          '</div><div class="adoption-value">' + adoption + '<span>%</span></div><div class="chart-label">' +
          bi(T("建议采纳率", "Recommendation adoption")) + '</div><div class="adoption-track" aria-hidden="true"><span style="width:' +
          adoption + '%"></span></div><div class="gmv-result"><strong>+' + growth + '%</strong><span>' +
          bi(T("GMV 增幅较对照组高", "GMV growth above control")) + '</span></div></div>'
        ).join('') + '</div>' + visualNote(T("项目整体效果；两期分别对照，不叠加，也不归因于单个 Agent 模块", "Project-level results. Each phase uses its own control; effects are not additive or attributed to an individual agent module")),
      takeaway: T("把模型输出接入可追踪、可迭代的业务流程", "Turn model outputs into a traceable, repeatable workflow")
    },
    "ali-forecast": {
      tab: T("预测优化", "Forecasting"), title: T("表征 → 后训练 → 稳定推理", "Representations, post-training & stability"),
      challenge: T("误差与稳定性分别衡量；后训练回到下游预测验证", "Evaluate accuracy and stability separately, then validate post-training downstream"),
      render: () => '<div class="visual-section-label">' + bi(T("wMAPE 相对下降 · 越低越好", "Relative wMAPE reduction · lower is better")) +
        '</div><div class="training-tree"><div class="training-node"><div><strong>' + bi(T("冻结 Qwen3 表征", "Frozen Qwen3 features")) +
        '</strong><span>' + bi(T("对比：同配置、无 Qwen", "vs. same setup without Qwen")) + '</span></div><b>↓ 2.1%</b></div>' +
        '<div class="tree-arrow" aria-hidden="true">↓</div><div class="training-node training-sft"><div><strong>LoRA SFT</strong><span>' +
        bi(T("对比：冻结表征", "vs. frozen representations")) + '</span></div><div class="training-score"><b>↓ 3.7%</b><span>' +
        bi(T("大促跃升样本 ↓ 6.2%", "Promotion jumps ↓ 6.2%")) + '</span></div></div>' +
        '<div class="tree-split-label">' + bi(T("同一 SFT 基线 · 两条路线分别评估", "Same SFT baseline · evaluated separately")) + '</div>' +
        '<div class="training-branches"><div class="training-branch"><strong>RLVR / GRPO</strong><b>↓ 2.9%</b><span>' +
        bi(T("标签正确性奖励", "Verifiable label reward")) + '</span></div><div class="training-branch"><strong>OPD</strong><b>↓ 3.1%</b><span>' +
        bi(T("任务教师概率指导", "Task-adapted teacher")) + '</span></div></div></div>' +
        visualNote(T("每条后训练路线均重训下游预测器；各阶段降幅不相加", "Retrain the downstream forecaster for each post-training route. Reductions are not additive")) +
        '<div class="stability-results"><div class="stability-heading"><strong>Monte Carlo Dropout</strong><span>' +
        bi(T("多次采样 → 均值输出", "Repeated samples → mean output")) + '</span></div><div><b>↓ 11%</b><span>' +
        bi(T("跨批次 CV", "Cross-batch CV")) + '</span></div><div><b>↓ 10%</b><span>' + bi(T("输入扰动敏感性", "Input sensitivity")) +
        '</span></div></div>' + visualNote(T("下方两项衡量输出稳定性，不是预测准确率", "The two Monte Carlo measures capture output stability, not accuracy")),
      takeaway: T("标签任务的提升，最终要在真实预测任务中成立", "A better label task must translate into better forecasting")
    },
    "ali-deformer": {
      tab: T("机制研究", "DEFormer"), title: T("诊断秩坍缩，验证去相关编码", "Diagnose collapse, validate decorrelation"),
      challenge: T("强自相关 → 注意力退化与 token 表征趋同", "Strong autocorrelation can degrade attention and make tokens converge"),
      render: () => diagramFlow([
        ["graph",T("表征诊断", "Diagnose"),T("稳定秩 / 相似度", "Rank / similarity")],
        ["scope",T("去相关编码", "Decorrelate"),T("原序列 + 差分", "Raw + differences")],
        ["execute",T("多任务验证", "Validate"),T("消融 / 业务指标", "Ablations / metrics")]
      ]) + '<figure class="comparison-chart"><figcaption>' + bi(T("真实零售数据 · wMAPE 越低越好", "Retail datasets · lower wMAPE is better")) +
        '</figcaption><div class="chart-legend"><span><i class="legend-baseline"></i>PatchTST</span><span><i class="legend-method"></i>DEFormer</span></div>' +
        [[4500,.292,.255,"12.7","3.5"],[9000,.266,.251,"5.6","1.2"]].map(([size,before,after,reduction,coverage]) =>
          '<div class="comparison-dataset"><div class="dataset-heading"><strong>' + bi(T("约 " + size.toLocaleString("en") + " 件商品", "~" + size.toLocaleString("en") + " products")) +
          '</strong><span>↓ ' + reduction + '%</span></div><div class="comparison-bars">' + [["baseline",before],["method",after]].map(([kind,value]) =>
            '<div class="comparison-row"><div class="comparison-track"><span class="bar-' + kind + '" style="width:' + (value/.32*100) + '%"></span></div><b>' + value.toFixed(3) + '</b></div>'
          ).join('') + '</div><div class="coverage-note">' + bi(T("销量加权覆盖率 +" + coverage + "%", "Sales-weighted coverage +" + coverage + "%")) + '</div></div>'
        ).join('') + '<div class="comparison-axis" aria-hidden="true"><span>0</span><span>0.16</span><span>0.32</span></div></figure>' +
        visualNote(T("两组柱形共用 0–0.32 刻度。DEFormer 论文已于 2026 年投稿", "Both datasets use the same 0–0.32 scale. DEFormer was submitted in 2026")),
      takeaway: T("从机制假设走到消融实验，再回到业务评估", "Link the mechanism to ablations and business-oriented evaluation")
    },
    "innox-definition": {
      tab:T("需求定义", "Discovery"),title:T("把用户声音转成首代产品范围", "From user needs to a first product scope"),
      challenge:T("让需求优先级与工程可行性共同决定先做什么", "Set priorities using both user needs and engineering feasibility"),
      render: () => '<div class="discovery-metric"><strong>200<span>+</span></strong><div>' + bi(T("用户访谈", "User interviews")) +
        '<span>' + bi(T("健康监测场景与需求", "Health-monitoring needs")) + '</span></div></div>' + diagramFlow([
        ["people",T("用户研究", "Research"),T("场景与痛点", "Contexts / needs")],
        ["scope",T("功能优先级", "Prioritize"),T("需求 × 可行性", "Needs × feasibility")],
        ["prototype",T("原型方案", "Prototype"),T("首代功能范围", "First-gen scope")]
      ]) + '<div class="outcome-strip">' + diagramIcon("prototype") + '<div><strong>' + bi(T("推进首代智能戒指样机开发", "Advanced the first smart-ring prototype")) +
        '</strong><span>' + bi(T("我的工作：调研、需求定义、原型规划与可行性协作", "My work: research, requirements, prototype planning and feasibility")) + '</span></div></div>',
      takeaway:T("将用户语言转成工程团队可以讨论与验证的选择", "Translate user language into choices engineers can discuss and test")
    },
    "innox-delivery": {
      tab:T("反馈交付", "Delivery"),title:T("让用户反馈进入下一轮迭代", "Keep user feedback inside the iteration loop"),
      challenge:T("对齐天使用户、软硬件研发与外部运营", "Align early adopters, engineering and external operations"),
      render: () => diagramFlow([
        ["people",T("天使用户", "Early adopters"),T("200+ 人社群", "200+ members")],
        ["prototype",T("样机测试", "Test"),T("组织与收集反馈", "Gather feedback")],
        ["memory",T("敏捷迭代", "Iterate"),T("协调研发与运营", "Align teams")]
      ],T("测试反馈 → 下一轮产品讨论", "Test feedback → next product decisions")) +
        '<div class="milestone-results"><div><b>6</b><span>' + bi(T("个月内完成核心里程碑", "months or less to core milestones")) +
        '</span></div><div>' + diagramIcon("energy") + '<strong>' + bi(T("种子轮投资", "Seed investment")) + '</strong><span>' +
        bi(T("项目获得孵化器投资", "From the incubator")) + '</span></div></div>' +
        visualNote(T("团队交付与项目融资成果；我的贡献是反馈渠道、测试组织与资源协调", "Team delivery and project funding outcomes; my contribution was feedback channels, testing and coordination")),
      takeaway:T("产品定义、工程讨论与用户验证，需要持续连接", "Keep definition, engineering and user validation connected")
    },
    "hust-wind": {
      tab:T("联邦预测", "Federated"),title:T("数据留在本地，学习跨场站联系", "Learn across farms while keeping data local"),
      challenge:T("共享空间联系，同时保留各场站的时间差异", "Share spatial relationships while preserving local temporal differences"),
      render: () => diagramFlow([
        ["local",T("本地数据", "Local data"),T("原始数据不出域", "Raw data stays local")],
        ["people",T("个性化联邦", "Personalize"),T("跨场站协同", "Federated learning")],
        ["graph",T("可学习动态图", "Dynamic graph"),T("空间与时间依赖", "Spatial / temporal")]
      ]) + '<div class="qualitative-results"><span>' + bi(T("跨场站预测", "Cross-farm forecasting")) + '</span><span>' +
        bi(T("降低通信开销", "Lower communication cost")) + '</span><span>' + bi(T("降低逆向工程风险", "Lower reverse-engineering risk")) +
        '</span></div>' + paperResult("IEEE Transactions on Network Science and Engineering", "2025", T("共同第一作者", "Co-first author")),
      takeaway:T("预测表现、隐私与通信开销，需要共同权衡", "Balance forecasting, privacy and communication together")
    },
    "hust-price": {
      tab:T("电价区间", "Intervals"),title:T("既预测数值，也表达不确定性", "Predict the value and express uncertainty"),
      challenge:T("应对日前电价的时间与特征动态变化", "Model the temporal and feature dynamics of day-ahead prices"),
      render: () => '<div class="prediction-diagram"><div class="prediction-input">' + bi(T("时序与动态特征", "Temporal & dynamic features")) +
        '</div><span class="tree-arrow" aria-hidden="true">↓</span><div class="prediction-model"><strong>' + bi(T("端到端预测框架", "End-to-end forecasting")) +
        '</strong><div>' + bi(T("非共享卷积 · GRU · 稠密跳跃注意力", "Non-shared convolution · GRU · Dense skip attention")) +
        '</div></div><div class="prediction-outputs"><div><svg viewBox="0 0 120 32" aria-hidden="true"><path d="M12 16h96"/><circle cx="60" cy="16" r="5"/></svg><strong>' +
        bi(T("点预测", "Point forecast")) + '</strong><span>' + bi(T("预测了多少", "The predicted value")) +
        '</span></div><div><svg viewBox="0 0 120 32" aria-hidden="true"><path d="M12 16h96"/><path class="interval-range" d="M32 16h56"/><path d="M32 10v12m56-12v12"/><circle cx="60" cy="16" r="4"/></svg><strong>' +
        bi(T("区间预测", "Interval forecast")) + '</strong><span>' + bi(T("可能的波动范围", "The plausible range")) +
        '</span></div></div></div>' + paperResult("IEEE Transactions on Power Systems", "2023", T("第二作者", "Second author")),
      takeaway:T("将不确定性纳入输出与评估", "Bring uncertainty into both the output and the evaluation")
    },
    "hust-review": {
      tab:T("系统综述", "Review"),title:T("把 AI 方法放回电力运行场景", "Place AI methods in their operating context"),
      challenge:T("沿着预测对象与用途组织研究方法", "Organize methods around forecasting targets and their uses"),
      render: () => diagramFlow([
        ["energy",T("源", "Generation"),T("发电侧", "Power generation")],
        ["home",T("荷", "Demand"),T("负荷侧", "Electricity demand")],
        ["grid",T("网", "Grid"),T("电网运行", "Grid operations")]
      ],null,true) + '<div class="review-synthesis"><span aria-hidden="true">↓</span><strong>' + bi(T("方法 × 预测对象 × 应用场景", "Methods × targets × operating contexts")) +
        '</strong><span>' + bi(T("文献研究 → 相关章节英文写作与修订", "Literature research → writing and revising the relevant sections")) + '</span></div>' +
        paperResult("Nature Reviews Electrical Engineering", "2024", T("第二作者", "Second author")),
      takeaway:T("先解释问题与用途，再讨论方法的条件与局限", "Explain the problem and use, then the method’s conditions and limits")
    }
  };
  const renderStory = (story, i) => {
    const visual = visualStories[story.id];
    return '<article class="story story-panel" id="' + story.id + '" role="tabpanel" aria-labelledby="tab-' + story.id + '"' +
      (i ? ' hidden' : '') + '><header class="visual-story-heading"><h4>' + bi(visual.title) + '</h4><p>' + bi(visual.challenge) +
      '</p></header><div class="story-visual">' + visual.render() + '</div><div class="visual-takeaway"><span aria-hidden="true">↗</span>' +
      bi(visual.takeaway) + '</div><details class="story-notes"><summary class="notes-summary">' + bi(ui.storyNotes,true) + toggle() +
      '</summary><div class="story-body"><div class="story-original-heading"><div class="story-original-title">' + bi(story.title) +
      '</div><p class="story-original-brief">' + bi(story.brief) + '</p></div>' +
    storyBlock(ui.problem, '<p>' + bi(story.problem) + '</p>') +
    storyBlock(ui.action, '<ul class="action-list">' + story.actions.map(a => '<li>' + bi(a) + '</li>').join('') + '</ul>') +
    storyBlock(ui.result, '<div class="result-box">' + bi(story.result) + '</div>') +
    storyBlock(ui.takeaway, '<p class="takeaway-text">' + bi(story.takeaway) + '</p>') +
    '<div class="story-footer">' + tags(story.stack) + (story.project ?
      '<a class="text-link" href="#' + story.project + '" data-open-project="' + story.project + '" aria-haspopup="dialog" aria-controls="project-preview" aria-expanded="false">' + bi(ui.viewProject, true) + arrow + '</a>' : '') +
    '</div></div></details></article>';
  };
  const renderStoryBoard = exp => '<div class="story-board"><div class="story-tabs" role="tablist" aria-label="' + escapeHTML(exp.company.en) + ' stories">' +
    exp.stories.map((story,i) => '<button type="button" role="tab" id="tab-' + story.id + '" aria-controls="' + story.id +
      '" aria-selected="' + (!i) + '" tabindex="' + (i ? '-1' : '0') + '" data-story-tab="' + story.id + '"><span class="tab-index" aria-hidden="true">0' +
      (i+1) + '</span>' + bi(visualStories[story.id].tab,true) + '</button>').join('') +
    '</div><div class="stories-list">' + exp.stories.map(renderStory).join('') + '</div></div>';
  const experienceLogos = {
    alibaba: [{id:"alibaba",src:"assets/logos/alibaba.ico"}],
    innox: [{id:"innox",src:"assets/logos/innox.png"}],
    hust: [{id:"hust",src:"assets/logos/hust.png"},{id:"psl",src:"assets/logos/psl.svg"}]
  };
  const renderStrategy = strategy => '<div class="experience-strategy"><h4 class="strategy-title">' + bi(strategy.title) +
    '</h4><div class="strategy-phases">' + strategy.phases.map((phase, i) =>
      (i ? '<div class="strategy-bridge"><span class="bridge-arrow" aria-hidden="true">↓</span><div><strong>' +
        bi(strategy.bridgeLabel) + '</strong><p>' + bi(strategy.bridge) + '</p></div></div>' : '') +
      '<section class="strategy-phase" id="' + phase.id + '" aria-labelledby="' + phase.id + '-title"><header class="strategy-phase-header">' +
      '<span class="strategy-number" aria-hidden="true">' + phase.number + '</span><div><p class="strategy-horizon">' + bi(phase.horizon) +
      '</p><h5 id="' + phase.id + '-title">' + bi(phase.title) + '</h5></div></header>' +
      '<dl class="strategy-points"><div><dt>' + bi(strategy.goalLabel) + '</dt><dd>' + bi(phase.goal) + '</dd></div></dl>' +
      '<div class="strategy-contributions"><div class="contribution-heading"><h6>' + bi(strategy.contributionLabel) +
      '</h6><span>' + bi(T("点击贡献，查看项目", "Select a contribution"),true) + '</span></div>' +
      '<div class="contribution-list">' + phase.links.map((link,j) => '<a class="contribution-link" href="#' + (link.view || link.target) + '" data-open-project="' + link.target + '" data-project-view="' + (link.view || '') + '" aria-controls="project-preview" aria-expanded="false">' +
        '<span class="contribution-index" aria-hidden="true">0' + (j+1) + '</span><span class="contribution-copy"><strong>' + bi(link.label) +
        '</strong><span class="contribution-action">' + bi(link.action) + '</span><span class="contribution-state"><span class="contribution-idle">' +
        bi(T("查看项目", "Explore project"),true) + '</span><span class="contribution-selected">' + bi(T("正在对照", "In view"),true) +
        '</span></span></span><span class="contribution-arrow" aria-hidden="true">' + arrow + '</span></a>').join('') + '</div></div>' +
      '<div class="strategy-impact"><strong>' + bi(phase.result) + '</strong><p>' + bi(phase.resultNote) + '</p></div></section>'
    ).join('') + '</div></div>';
  const renderExperience = exp => '<article class="experience-card" id="' + exp.id + '">' +
    '<div class="experience-timeline"><span class="date">' + exp.date.replace(' — ', '<span class="date-dash">—</span>') +
    '</span><span class="kind">' + bi(ui[exp.kind], true) + '</span></div><div class="experience-content">' +
    '<header class="experience-header"><span class="experience-logos">' + experienceLogos[exp.id].map(logo =>
    '<span class="experience-logo experience-logo--' + logo.id + '"><img src="' + logo.src +
    '" alt="" width="48" height="48" decoding="async"></span>').join('') + '</span>' +
    '<div class="experience-heading"><h3>' + bi(exp.company) + '</h3><div class="experience-role">' + bi(exp.role) +
    '</div><div class="company-entity">' + bi(exp.entity) + '</div></div></header>' +
    experienceOverview(exp) + (exp.strategy ? renderStrategy(exp.strategy) :
    '<details class="context-disclosure"><summary class="context-summary">' + bi(ui.contextDetails, true) + toggle() +
    '</summary><div class="context-grid"><div><h4 class="small-label">' + bi(ui.background) +
    '</h4><p>' + bi(exp.background) +
    '</p></div><div><h4 class="small-label">' + bi(ui.responsibility) +
    '</h4><p>' + bi(exp.responsibilities) +
    '</p></div></div></details>' + renderStoryBoard(exp)) + '</div></article>';
  const renderTable = table => '<div class="table-wrap"><table class="result-table"><thead><tr>' +
    table.headers.map(h => '<th scope="col">' + bi(h) + '</th>').join('') + '</tr></thead><tbody>' +
    table.rows.map(row => '<tr>' + row.map(cell => '<td>' + bi(cell) + '</td>').join('') + '</tr>').join('') +
    '</tbody></table></div><p class="table-note">' + bi(table.note) + '</p>';
  const renderMetrics = metrics => '<div class="metric-row">' + metrics.map(m => '<div class="metric">' +
    '<div class="metric-value">' + bi(m.value) + '</div><div class="metric-label">' + bi(m.label) + '</div></div>').join('') + '</div>';
  // Concept diagrams describe each project; they are not product screenshots or measured charts.
  const projectVisual = project => {
    const diagrams = {
      "project-agent": '<path d="M29 35h31m24 0h31M115 35v36H29V56"/><rect x="15" y="24" width="27" height="23" rx="6"/><rect x="60" y="24" width="27" height="23" rx="6"/><rect x="103" y="24" width="27" height="23" rx="6"/><circle cx="29" cy="70" r="6"/><path d="m25 54 4-5 4 5"/>',
      "project-wiki": '<rect x="18" y="18" width="47" height="58" rx="6"/><path d="M29 31h23m-23 10h23m-23 10h15m21-10h15l16-12m-16 12 19 23"/><circle cx="103" cy="25" r="9"/><circle cx="109" cy="69" r="10"/><circle cx="84" cy="44" r="5"/>',
      "project-qwen": '<rect x="16" y="23" width="39" height="20" rx="5"/><rect x="16" y="54" width="39" height="20" rx="5"/><path d="M55 33h15l13 14m-28 17h15l13-17m0 0h18m0 0 10-16 8 10 12-18"/><circle cx="83" cy="47" r="5"/>',
      "project-deformer": '<path d="M17 25h24m-24 13h24m-24 13h24m-24 13h24m19-17h22m-7-6 7 6-7 6M101 20v53m10-42v42m10-48v48m10-34v34"/>',
      "project-ring": '<ellipse cx="73" cy="46" rx="32" ry="35"/><ellipse cx="73" cy="46" rx="22" ry="27"/><path d="m97 19 7-6M39 76l8-8M111 64h19m-9-4 9 4-9 4"/>',
      "project-hust-wind": '<circle cx="35" cy="28" r="8"/><circle cx="110" cy="28" r="8"/><circle cx="73" cy="67" r="8"/><path d="M43 28h59M41 34l26 27m36-27L79 61"/>',
      "project-hust-price": '<path d="M20 65h108M24 71V20m9 31 17-14 18 8 19-20 31 10m-85 9 17-15 18 8 19-20 31 10m-85 27 17-9 18 8 19-20 31 10"/>',
      "project-hust-review": '<rect x="18" y="22" width="31" height="48" rx="5"/><rect x="58" y="22" width="31" height="48" rx="5"/><rect x="98" y="22" width="31" height="48" rx="5"/><path d="M25 34h17m23 0h17m23 0h17M25 44h12m28 0h12m28 0h12"/>'
    };
    const labels = {"project-agent":"AGENT", "project-wiki":"WIKI", "project-qwen":"QWEN3", "project-deformer":"DEFORMER", "project-ring":"PRODUCT", "project-hust-wind":"FEDERATED", "project-hust-price":"FORECAST", "project-hust-review":"REVIEW"};
    return '<span class="project-visual" aria-hidden="true"><span class="visual-top"><span>' + project.index +
      '</span><span class="visual-dots">•••</span></span><svg viewBox="0 0 148 92">' + diagrams[project.id] +
      '</svg><span class="visual-label">' + labels[project.id] + '</span></span>';
  };
  // Technical diagrams live in the project deep dives; experiences retain their overview.
  // Preserve earlier story anchors so bookmarked links still open the appropriate project.
  const renderProjectStudy = (project,storyId = project.visualStory) => {
    const visual = visualStories[storyId];
    return '<div class="project-study" id="' + storyId + '"><div class="visual-story-heading"><h4>' +
      bi(visual.title) + '</h4><p>' + bi(visual.challenge) + '</p></div><div class="story-visual">' + visual.render() + '</div></div>';
  };
  const renderProject = project => '<details class="project-card" id="' + project.id + '"><summary class="project-summary">' +
    projectVisual(project) + '<div class="project-heading"><div class="eyebrow">' + bi(project.category) +
    '</div><h3>' + bi(project.title) + '</h3><p>' + bi(project.description) + '</p>' + tags(project.tags.slice(0,3)) + '</div>' + toggle() + '</summary>' +
    renderProjectBody(project) + '</details>';
  const renderProjectBody = project =>
    '<div class="project-body"><div class="project-role"><h4 class="small-label">' + bi(ui.role) +
    '</h4><div>' + bi(project.role) +
    '</div></div><div class="project-context"><div><h4 class="small-label">' + bi(ui.context) +
    '</h4><p>' + bi(project.context) +
    '</p></div><div><h4 class="small-label">' + bi(ui.challenge) +
    '</h4><p>' + bi(project.challenge) + '</p></div></div>' +
    (project.visualStories ? project.visualStories.map(id => renderProjectStudy(project,id)).join('') :
      project.visualStory ? renderProjectStudy(project) : '<ol class="flow" aria-label="Workflow">' + project.flow.map((step,i) => '<li class="flow-step"><span class="flow-index">0' +
    (i+1) + '</span>' + bi(step) + '</li>').join('') + '</ol>') +
    '<h4 class="small-label">' + bi(ui.decisions) +
    '</h4><div class="decision-list">' + project.decisions.map((d,i) =>
      '<div class="decision"><span class="number">0' + (i+1) + '</span><div><h4>' + bi(d.title) + '</h4><p>' +
      bi(d.body) + '</p></div></div>').join('') + '</div>' +
    '<h4 class="small-label">' + bi(ui.result) +
    '</h4>' + (project.table && !project.visualStory ? renderTable(project.table) : '') +
    (project.metrics ? renderMetrics(project.metrics) : '') + '<p class="project-outcome">' + bi(project.outcome) + '</p>' +
    '<div class="learning-box"><h4 class="small-label">' + bi(ui.learnings) +
    '</h4><p>' + bi(project.learning) +
    '</p></div><div class="project-footer">' + tags(project.tags) + (project.related ?
      '<a class="text-link" href="#' + project.related + '">' + bi(ui.workLink, true) + arrow + '</a>' : '') + '</div></div>';
  const heading = (index, title, description, controls = false, count = false) => '<div class="section-top"><div>' +
    '<div class="eyebrow">0' + index + ' / ' + ["EXPERIENCE","PROJECTS","SKILLS","EDUCATION"][index-1] +
    '</div><h2 class="section-title">' + bi(title) + '</h2><p class="section-description">' + bi(description) + '</p></div>' +
    (controls ? '<div class="section-controls"><button class="quiet-button" type="button" data-expand-all>' +
      bi(index === 1 ? ui.expandNotes : ui.expandAll, true) + '</button><button class="quiet-button" type="button" data-collapse-all>' +
      bi(index === 1 ? ui.collapseNotes : ui.collapseAll, true) + '</button></div>' : '') +
    (count ? '<span class="project-count">' + bi(ui.projectCount, true) + '</span>' : '') + '</div>';
  document.getElementById("app").innerHTML =
    '<a class="skip-link" href="#main">' + bi(ui.skip, true) + '</a>' +
    '<div class="ambient-light" aria-hidden="true"></div><div class="reading-line" aria-hidden="true"></div>' +
    '<div class="language-dock"><div class="language-switch" role="group" aria-label="Language / 语言">' +
    '<button type="button" data-language="zh" lang="zh-CN" aria-label="切换到中文">中</button>' +
    '<button type="button" data-language="en" lang="en" aria-label="Switch to English">EN</button></div></div>' +
    '<div class="page-shell" id="top"><div class="site-layout"><aside class="profile">' +
    '<div class="profile-main"><a class="profile-name" href="#top"><span class="profile-kicker">JASON DING</span><h1>' + bi(data.name) + '</h1></a>' +
    '<p class="profile-role">' + bi(ui.headline) + '</p><p class="profile-tagline">' + bi(data.tagline) + '</p>' +
    '<nav class="section-nav" aria-label="On this page">' + navLinks(true) + '</nav></div>' +
    '<div class="profile-footer"><a class="profile-email" href="mailto:' + data.email + '">' +
    '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3"/><path d="m4 7 8 6 8-6"/></svg>' +
    data.email + diagonal + '</a><a class="profile-scholar" href="' + data.scholar + '" target="_blank" rel="noopener noreferrer">' +
    '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m2 9 10-5 10 5-10 5-10-5m4 3v5l6 3 6-3v-5M22 9v7"/></svg>Google Scholar' + diagonal +
    '</a></div></aside><nav class="mobile-index" aria-label="Page sections">' + navLinks() + '</nav><main class="main-content" id="main">' +
    '<section class="section" id="experience">' + heading(1,ui.workTitle,ui.workDesc) + data.experience.map(renderExperience).join('') + '</section>' +
    '<section class="section" id="projects">' + heading(2,ui.projectTitle,ui.projectDesc,true,true) +
    data.projects.map(renderProject).join('') + '<div class="research-collection" id="research-projects"><div class="research-collection-heading"><div class="eyebrow">RESEARCH / ' + String(researchProjects.length).padStart(2,'0') + '</div><h3>' +
    bi(T("相关研究详解", "Research deep dives")) + '</h3><p>' + bi(T("从 Transformer 机制研究，到电力系统预测与 AI 应用", "From Transformer mechanisms to power-system forecasting and AI applications")) +
    '</p></div>' + researchProjects.map(renderProject).join('') + '</div></section>' +
    '<section class="section" id="skills">' + heading(3,ui.skillsTitle,ui.skillsDesc) +
    '<div class="skill-grid">' + data.skills.map(group => '<div class="skill-group"><h3>' + bi(group.title) + '</h3>' + tags(group.items) + '</div>').join('') +
    '</div><p class="language-note">' + dot + bi(data.language,true) + '</p></section>' +
    '<section class="section" id="education">' + heading(4,ui.educationTitle,ui.educationDesc) +
    '<div class="education-list">' + data.education.map(ed => '<div class="education-row"><div><h3>' + bi(ed.name) +
      '</h3><p>' + bi(ed.degree) + '</p>' + (ed.note ? '<div class="education-note">' + bi(ed.note) + '</div>' : '') +
      '</div><span class="date">' + ed.date + '</span></div>').join('') + '</div>' +
    '<div class="papers"><div class="papers-header"><h3>' + bi(ui.selectedPapers) +
    '</h3><a class="text-link" href="' + data.scholar + '" target="_blank" rel="noopener noreferrer">' + bi(ui.allPapers,true) +
    diagonal + '</a></div><div class="paper-list">' + data.papers.map(paper =>
      '<div class="paper"><div class="paper-title">' + escapeHTML(paper.title) + '</div><div class="paper-venue">' +
      bi(paper.venue) + '</div></div>').join('') + '</div><p class="honors">' + bi(data.honors) + '</p></div></section>' +
    '<footer class="contact-section" id="contact"><h2>' + bi(ui.contactTitle) + '</h2><p>' + bi(ui.contactDesc) +
    '</p><div class="footer-links"><a href="mailto:' + data.email + '">' + data.email + diagonal +
    '</a><a href="' + data.scholar +
    '" target="_blank" rel="noopener noreferrer">Google Scholar' + diagonal + '</a></div></footer><div class="bottom-bar"><span>' + bi(ui.source) + '</span><a href="#top">© 2026 Jason Ding' + up + '</a></div></main></div></div>';
  document.getElementById("app").insertAdjacentHTML("beforeend",
    '<div class="comparison-bar"><span class="comparison-identity">JASON DING</span><span class="comparison-divider" aria-hidden="true">/</span>' +
    '<span class="comparison-company"></span><span class="comparison-label">' + bi(T("经历总览", "Experience"),true) + '</span></div>' +
    '<dialog class="project-preview" id="project-preview" aria-labelledby="preview-project-title">' +
    '<div class="preview-toolbar"><button class="preview-back" type="button" data-preview-close>' +
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m14 6-6 6 6 6"/></svg>' +
    '<span class="preview-mobile-label">' + bi(T("返回经历", "Back to experience"), true) + '</span><span class="preview-desktop-label">' +
    bi(T("恢复布局", "Restore layout"),true) + '</span></button><div class="preview-breadcrumb"></div>' +
    '<div class="preview-toolbar-actions"><div class="language-switch" role="group" aria-label="Language / 语言">' +
    '<button type="button" data-language="zh" lang="zh-CN" aria-label="切换到中文">中</button>' +
    '<button type="button" data-language="en" lang="en" aria-label="Switch to English">EN</button></div>' +
    '<button class="preview-close" type="button" data-preview-close aria-label="关闭项目详情">' +
    '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m7 7 10 10M17 7 7 17"/></svg></button></div></div>' +
    '<div class="preview-mobile-projects" role="group" aria-label="Related projects"></div>' +
    '<div class="preview-workspace"><div class="preview-detail">' +
    '<header class="preview-project-header"><div class="eyebrow" id="preview-project-category"></div>' +
    '<h2 id="preview-project-title"></h2><p id="preview-project-description"></p></header>' +
    '<nav class="preview-tabs" aria-label="Project sections">' + [
      ["diagram",T("图解", "Visuals")],["context",T("背景", "Context")],
      ["approach",T("方案", "Approach")],["results",T("结果", "Results")]
    ].map(([key,label]) => '<button type="button" data-preview-section="' + key + '">' + bi(label,true) + '</button>').join('') +
    '</nav><div class="preview-scroll" tabindex="0"><div class="preview-content"></div></div></div></div></dialog>'
  );
  function setLanguage(language, persist = true) {
    const lang = language === "en" ? "en" : "zh";
    document.documentElement.className = "lang-" + lang;
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    document.title = lang === "zh" ? "丁逸洲 Jason · AI 工程与应用研究" : "Jason Ding · AI Engineering & Applied Research";
    document.querySelector('meta[name="description"]').content = lang === "zh" ?
      "丁逸洲 Jason 的双语个人网站：AI 算法、Agent 工作流、时序预测研究与产品实践" :
      "Jason Ding’s bilingual portfolio of applied AI, agent workflows, forecasting research and product development";
    document.querySelectorAll(".bi").forEach(el => {
      el.querySelector(":scope > .zh").setAttribute("aria-hidden", lang === "zh" ? "false" : "true");
      el.querySelector(":scope > .en").setAttribute("aria-hidden", lang === "en" ? "false" : "true");
    });
    document.querySelectorAll("[data-language]").forEach(button =>
      button.setAttribute("aria-pressed", String(button.dataset.language === lang)));
    document.querySelector(".preview-close").setAttribute("aria-label", lang === "zh" ? "关闭项目详情" : "Close project details");
    if (persist) { try { localStorage.setItem("jason-portfolio-language",lang); } catch (_) {} }
  }
  setLanguage(document.documentElement.classList.contains("lang-en") ? "en" : "zh", false);
  function selectStory(id, focus = false) {
    const panel = document.getElementById(id);
    if (!panel || !panel.classList.contains("story-panel")) return;
    const board = panel.closest(".story-board");
    board.classList.remove("all-stories");
    board.querySelector(".story-tabs").hidden = false;
    board.querySelectorAll("[data-story-tab]").forEach(tab => {
      const selected = tab.dataset.storyTab === id;
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
      if (selected && focus) tab.focus();
    });
    board.querySelectorAll(".story-panel").forEach(item => { item.hidden = item !== panel; });
    scheduleReadingUpdate();
  }
  function showAllStories(section, show) {
    section.querySelectorAll(".story-board").forEach(board => {
      board.classList.toggle("all-stories", show);
      board.querySelector(".story-tabs").hidden = show;
      const selected = board.querySelector('[data-story-tab][aria-selected="true"]').dataset.storyTab;
      board.querySelectorAll(".story-panel").forEach(panel => { panel.hidden = !show && panel.id !== selected; });
    });
  }
  const disclosureAnimations = new WeakMap();
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const preview = document.getElementById("project-preview");
  const previewScroll = preview.querySelector(".preview-scroll");
  const previewContent = preview.querySelector(".preview-content");
  const desktopComparison = window.matchMedia("(min-width: 1024px)");
  let previewOrigin = null;
  let previewPagePosition = {x:0,y:0};
  let previewReturnAnchor = null;
  let previewReturnOffset = 0;
  let previewFramePending = false;
  const previewMotion = {transition:null,animations:[],pending:null,cleanup:null,version:0};
  const previewTiming = {duration:500,easing:"cubic-bezier(.22,1,.36,1)"};
  const previewNames = {
    "project-deformer": T("DEFormer", "DEFormer"),
    "project-qwen": T("预测优化", "Forecasting"),
    "project-agent": T("成长规划", "Growth planning"),
    "project-ring": T("智能戒指", "Smart ring"),
    "innox-definition": T("需求定义", "Discovery"),
    "innox-delivery": T("反馈迭代", "Iteration"),
    "project-hust-wind": T("联邦预测", "Federated"),
    "project-hust-price": T("电价预测", "Price forecasting"),
    "project-hust-review": T("系统综述", "Review")
  };
  function updatePreviewSection() {
    previewFramePending = false;
    const top = previewScroll.getBoundingClientRect().top;
    let selected = "diagram";
    previewContent.querySelectorAll("[data-preview-anchor]").forEach(anchor => {
      if (anchor.getBoundingClientRect().top <= top + 90) selected = anchor.dataset.previewAnchor;
    });
    preview.querySelectorAll("[data-preview-section]").forEach(button => {
      if (button.dataset.previewSection === selected) button.setAttribute("aria-current", "location");
      else button.removeAttribute("aria-current");
    });
  }
  function renderPreviewContext(project) {
    const view = preview.dataset.view || "";
    const matchesProject = link => link.target === project.id && (link.view || "") === view;
    const exp = data.experience.find(item => item.strategy ?
      item.strategy.phases.some(phase => phase.links.some(matchesProject)) :
      item.stories.some(story => story.project === project.id));
    const phase = exp?.strategy?.phases.find(item => item.links.some(matchesProject));
    const links = exp?.strategy ? exp.strategy.phases.flatMap(item => item.links) : [{target:project.id,label:project.title}];
    preview.querySelector(".preview-breadcrumb").innerHTML = bi(exp?.shortCompany || exp?.company || ui.viewProject, true) +
      (phase ? '<span aria-hidden="true">/</span>' + bi(phase.previewLabel || T("阶段 " + phase.number, "Stage " + phase.number),true) : '');
    document.querySelector(".comparison-company").innerHTML = bi(exp?.shortCompany || exp?.company || ui.workTitle,true);
    preview.querySelector(".preview-mobile-projects").innerHTML = links.map(link =>
      '<button type="button" data-preview-project="' + link.target + '" data-preview-view="' + (link.view || '') + '" aria-pressed="' + matchesProject(link) + '">' +
      bi(previewNames[link.view || link.target] || link.label,true) + '</button>').join('');
    document.querySelectorAll("[data-open-project]").forEach(link => {
      const selected = link.dataset.openProject === project.id && (link.dataset.projectView || "") === view;
      link.setAttribute("aria-expanded",String(selected));
      if (selected) link.setAttribute("aria-current","true");
      else link.removeAttribute("aria-current");
    });
  }
  function currentContribution() {
    return Array.from(document.querySelectorAll(".contribution-link")).find(link =>
      link.dataset.openProject === preview.dataset.project && (link.dataset.projectView || "") === (preview.dataset.view || ""));
  }
  function settlePreviewMotion() {
    // Commit the latest destination before starting another interaction.
    previewMotion.transition?.skipTransition();
    previewMotion.pending?.();
    previewMotion.animations.forEach(animation => animation.cancel());
    previewMotion.cleanup?.();
    previewMotion.animations = [];
    previewMotion.transition = null;
  }
  function runPreviewMotion(change, kind, immediate = false) {
    const version = ++previewMotion.version;
    const root = document.documentElement;
    const source = desktopComparison.matches ? previewReturnAnchor : null;
    document.querySelector(".preview-motion-source")?.classList.remove("preview-motion-source");
    source?.classList.add("preview-motion-source");
    root.dataset.previewMotion = kind;
    root.dataset.previewMotionLayout = desktopComparison.matches ? "split" : "sheet";
    let changed = false;
    const update = () => {
      if (changed) return;
      changed = true;
      previewMotion.pending = null;
      change();
    };
    const cleanup = () => {
      if (version !== previewMotion.version) return;
      source?.classList.remove("preview-motion-source");
      delete root.dataset.previewMotion;
      delete root.dataset.previewMotionLayout;
      previewMotion.transition = null;
      previewMotion.animations = [];
      previewMotion.cleanup = null;
    };
    previewMotion.cleanup = cleanup;
    previewMotion.pending = update;
    if (immediate || reducedMotion.matches) { update(); cleanup(); return; }
    if (document.startViewTransition) {
      // Capture both layouts so the selected experience keeps its visual identity.
      const transition = document.startViewTransition(update);
      previewMotion.transition = transition;
      // An interrupted snapshot is expected when people click again quickly.
      transition.ready.catch(() => {});
      transition.finished.then(cleanup,cleanup);
      return;
    }
    // Older browsers use the same timing, with a geometry-based fallback.
    const animate = (element,frames,duration = previewTiming.duration) => {
      const animation = element.animate(frames,{...previewTiming,duration});
      previewMotion.animations.push(animation);
      return animation;
    };
    const offset = desktopComparison.matches ? "translateX(28px) scale(.985)" : "translateY(22px) scale(.965)";
    const before = source?.getBoundingClientRect();
    const moveSource = () => {
      const after = source?.getBoundingClientRect();
      if (!before || !after?.width || !after.height) return;
      return animate(source,[
        {transformOrigin:"top left",transform:"translate(" + (before.left-after.left) + "px," +
          (before.top-after.top) + "px) scale(" + before.width/after.width + "," + before.height/after.height + ")"},
        {transformOrigin:"top left",transform:"none"}
      ]);
    };
    if (kind === "close") {
      const animation = animate(preview,[{opacity:1,transform:"none"},{opacity:0,transform:offset}],300);
      animation.finished.then(() => {
        update();
        const returning = moveSource();
        if (returning) returning.finished.then(cleanup,cleanup);
        else cleanup();
      },() => {});
      return;
    }
    update();
    if (kind === "open") moveSource();
    animate(kind === "switch" ? preview.querySelector(".preview-detail") : preview,
      [{opacity:kind === "switch" ? .25 : 0,transform:kind === "switch" ? "translateY(8px)" : offset},
       {opacity:1,transform:"none"}],kind === "switch" ? 260 : 500);
    Promise.allSettled(previewMotion.animations.map(animation => animation.finished)).then(cleanup);
  }
  function alignComparisonSource() {
    const source = currentContribution() || previewOrigin;
    const anchor = source?.closest(".strategy-phase") || source?.closest(".story-panel") || source;
    if (anchor) window.scrollTo({top:window.scrollY + anchor.getBoundingClientRect().top - 88,behavior:"instant"});
    // Longer research overviews still keep the selected contribution in view.
    if (source && source.getBoundingClientRect().bottom > window.innerHeight - 36) {
      window.scrollBy({top:source.getBoundingClientRect().bottom - window.innerHeight + 36,behavior:"instant"});
    }
  }
  function restoreExperiencePosition() {
    const top = previewPagePosition.width === window.innerWidth || !previewReturnAnchor ? previewPagePosition.y :
      window.scrollY + previewReturnAnchor.getBoundingClientRect().top - previewReturnOffset;
    window.scrollTo({left:previewPagePosition.x,top,behavior:"instant"});
  }
  function setPreviewLayout() {
    const desktop = desktopComparison.matches;
    const detailScroll = previewScroll.scrollTop;
    // The desktop dialog is a normal grid column. Only narrow screens are modal.
    if (preview.open) preview.close();
    document.body.classList.toggle("project-compare-open",desktop);
    document.body.classList.toggle("project-preview-open",!desktop);
    preview.dataset.layout = desktop ? "split" : "sheet";
    preview.setAttribute("aria-modal",String(!desktop));
    if (desktop) {
      preview.show();
      alignComparisonSource();
      (currentContribution() || previewOrigin)?.focus({preventScroll:true});
    } else {
      preview.showModal();
      preview.querySelector(".preview-back").focus({preventScroll:true});
      restoreExperiencePosition();
    }
    previewScroll.scrollTop = detailScroll;
  }
  function openProjectPreview(id, origin, requestedView = "") {
    const project = projectCatalog.find(item => item.id === id);
    if (!project) return;
    const view = origin?.dataset.projectView || requestedView;
    const viewInfo = project.views?.[view];
    if (view && !viewInfo) return;
    settlePreviewMotion();
    const wasOpen = preview.open;
    if (wasOpen && preview.dataset.project === id && (preview.dataset.view || "") === view) {
      preview.querySelector(".preview-scroll").focus({preventScroll:true});
      return;
    }
    const fromProjectSwitcher = !!document.activeElement?.closest(".preview-mobile-projects");
    if (!wasOpen) {
      previewOrigin = origin;
      previewPagePosition = {x:window.scrollX,y:window.scrollY,width:window.innerWidth};
      previewReturnAnchor = origin?.closest(".strategy-phase") || origin?.closest(".story-panel") || origin;
      previewReturnOffset = previewReturnAnchor?.getBoundingClientRect().top || 0;
    }
    // A contribution can select a specific chapter of a shared project.
    let body;
    if (viewInfo) {
      const story = experienceStories.find(item => item.id === view);
      const wrapper = document.createElement("div");
      wrapper.innerHTML = renderProjectBody({...project,...viewInfo,visualStories:undefined,visualStory:view,
        challenge:story.problem,decisions:story.actions.map((action,i) => ({title:viewInfo.decisionTitles[i],body:action})),
        outcome:story.result,learning:story.takeaway,tags:story.stack,metrics:undefined});
      body = wrapper.firstElementChild;
    } else body = document.getElementById(id).querySelector(".project-body").cloneNode(true);
    // Keep copied document IDs unique.
    body.querySelectorAll("[id]").forEach(element => { element.id = "preview-" + element.id; });
    const diagram = body.querySelector(".project-study") || body.querySelector(".flow");
    if (diagram) { body.prepend(diagram); diagram.dataset.previewAnchor = "diagram"; }
    body.querySelector(".project-role").dataset.previewAnchor = "context";
    const decisions = body.querySelector(".decision-list");
    decisions.previousElementSibling.dataset.previewAnchor = "approach";
    decisions.nextElementSibling.dataset.previewAnchor = "results";
    const returnLink = body.querySelector(".project-footer .text-link");
    if (returnLink) {
      returnLink.dataset.previewClose = "";
      returnLink.innerHTML = bi(T("关闭项目 · 恢复布局", "Close project · Restore layout"),true) + arrow;
    }
    runPreviewMotion(() => {
      preview.dataset.project = id;
      preview.dataset.view = view;
      renderPreviewContext(project);
      preview.querySelector("#preview-project-category").innerHTML = bi(project.category);
      preview.querySelector("#preview-project-title").innerHTML = bi(viewInfo?.title || project.title);
      preview.querySelector("#preview-project-description").innerHTML = bi(viewInfo?.description || project.description);
      previewContent.replaceChildren(body);
      previewScroll.scrollTop = 0;
      setLanguage(document.documentElement.lang === "en" ? "en" : "zh", false);
      if (!wasOpen) setPreviewLayout();
      if (fromProjectSwitcher) preview.querySelector('[data-preview-project="' + id + '"][data-preview-view="' + view + '"]')?.focus({preventScroll:true});
      // A hidden scroll container can retain its old offset until it is displayed.
      previewScroll.scrollTop = 0;
      updatePreviewSection();
    },wasOpen ? "switch" : "open");
  }
  function closeProjectPreview(immediate = false) {
    settlePreviewMotion();
    if (!preview.open) return;
    runPreviewMotion(() => {
      preview.close();
      document.body.classList.remove("project-preview-open","project-compare-open");
      document.querySelectorAll("[data-open-project]").forEach(link => {
        link.setAttribute("aria-expanded","false");
        link.removeAttribute("aria-current");
      });
      previewOrigin?.focus({preventScroll:true});
      restoreExperiencePosition();
    },"close",immediate);
  }
  preview.addEventListener("cancel",event => { event.preventDefault(); closeProjectPreview(); });
  desktopComparison.addEventListener("change",() => {
    settlePreviewMotion();
    if (!preview.open) return;
    setPreviewLayout();
    updatePreviewSection();
  });
  reducedMotion.addEventListener("change",() => {
    if (reducedMotion.matches) settlePreviewMotion();
  });
  preview.addEventListener("click",event => {
    if (event.target !== preview) return;
    const rect = preview.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeProjectPreview();
  });
  previewScroll.addEventListener("scroll",() => {
    if (!previewFramePending) { previewFramePending = true; requestAnimationFrame(updatePreviewSection); }
  },{passive:true});
  function setDisclosure(detail, open, animate = false) {
    const start = detail.getBoundingClientRect().height;
    const pending = disclosureAnimations.get(detail);
    if (pending) pending.animation.cancel();
    disclosureAnimations.delete(detail);
    detail.style.removeProperty("overflow");
    if (!animate || reducedMotion.matches || !detail.animate) {
      detail.open = open;
      return;
    }
    detail.open = true;
    const style = getComputedStyle(detail);
    const outer = ["paddingTop", "paddingBottom", "borderTopWidth", "borderBottomWidth"]
      .reduce((sum, property) => sum + parseFloat(style[property]), 0);
    const end = open ? detail.getBoundingClientRect().height : detail.querySelector("summary").getBoundingClientRect().height + outer;
    detail.style.overflow = "hidden";
    const animation = detail.animate({ height: [start + "px", end + "px"] }, {
      duration: 340, easing: "cubic-bezier(.22,1,.36,1)", fill: "both"
    });
    const state = { animation, open };
    disclosureAnimations.set(detail, state);
    animation.onfinish = () => {
      if (disclosureAnimations.get(detail) !== state) return;
      detail.open = open;
      animation.cancel();
      detail.style.removeProperty("overflow");
      disclosureAnimations.delete(detail);
      scheduleReadingUpdate();
    };
  }
  document.addEventListener("click",event => {
    const projectTrigger = event.target.closest("[data-open-project]");
    if (projectTrigger && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      openProjectPreview(projectTrigger.dataset.openProject, projectTrigger);
      return;
    }
    const previewClose = event.target.closest("[data-preview-close]");
    if (previewClose) { event.preventDefault(); closeProjectPreview(); return; }
    const previewProject = event.target.closest("[data-preview-project]");
    if (previewProject) { openProjectPreview(previewProject.dataset.previewProject,undefined,previewProject.dataset.previewView); return; }
    const previewSection = event.target.closest("[data-preview-section]");
    if (previewSection) {
      const anchor = previewContent.querySelector('[data-preview-anchor="' + previewSection.dataset.previewSection + '"]');
      if (anchor) previewScroll.scrollTo({
        top:previewScroll.scrollTop + anchor.getBoundingClientRect().top - previewScroll.getBoundingClientRect().top - 8,
        behavior:reducedMotion.matches ? "instant" : "smooth"
      });
      return;
    }
    const languageButton = event.target.closest("[data-language]");
    if (languageButton) { settlePreviewMotion(); setLanguage(languageButton.dataset.language); }
    const storyTab = event.target.closest("[data-story-tab]");
    if (storyTab) selectStory(storyTab.dataset.storyTab);
    const control = event.target.closest("[data-expand-all],[data-collapse-all]");
    if (control) {
      const expand = control.hasAttribute("data-expand-all");
      showAllStories(control.closest("section"), expand);
      control.closest("section").querySelectorAll("details").forEach(detail => setDisclosure(detail, expand));
      scheduleReadingUpdate();
    }
    const summary = event.target.closest("summary");
    if (summary && summary.parentElement.tagName === "DETAILS") {
      event.preventDefault();
      const detail = summary.parentElement;
      const current = disclosureAnimations.get(detail);
      setDisclosure(detail, !(current ? current.open : detail.open), true);
    }
    const link = event.target.closest('a[href^="#"]');
    if (link) {
      const target = document.getElementById(link.getAttribute("href").slice(1));
      if (target) {
        const panel = target.closest(".story-panel");
        if (panel) selectStory(panel.id);
        let ancestor = target;
        while (ancestor && ancestor !== document.body) {
          if (ancestor.tagName === "DETAILS") setDisclosure(ancestor, true);
          ancestor = ancestor.parentElement;
        }
      }
    }
  });
  document.addEventListener("keydown", event => {
    if ((preview.open || previewMotion.pending) && event.key === "Escape") {
      event.preventDefault(); closeProjectPreview(); return;
    }
    if (preview.open && preview.dataset.layout === "sheet" && event.key === "Tab") {
      const controls = Array.from(preview.querySelectorAll('button:not([disabled]),a[href],[tabindex="0"]'))
        .filter(element => element.getClientRects().length && getComputedStyle(element).visibility !== "hidden");
      const first = controls[0], last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !preview.contains(document.activeElement))) {
        event.preventDefault(); last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !preview.contains(document.activeElement))) {
        event.preventDefault(); first?.focus();
      }
      return;
    }
    const tab = event.target.closest("[data-story-tab]");
    if (!tab || !["ArrowLeft","ArrowRight","Home","End"].includes(event.key)) return;
    event.preventDefault();
    const tabs = Array.from(tab.closest(".story-tabs").querySelectorAll("[data-story-tab]"));
    const current = tabs.indexOf(tab);
    const index = event.key === "Home" ? 0 : event.key === "End" ? tabs.length - 1 :
      (current + (event.key === "ArrowRight" ? 1 : -1) + tabs.length) % tabs.length;
    selectStory(tabs[index].dataset.storyTab, true);
  });
  function openHashTarget() {
    settlePreviewMotion();
    if (preview.open) closeProjectPreview(true);
    const id = decodeURIComponent(location.hash.slice(1));
    const target = document.getElementById(id);
    if (!target) return;
    const panel = target.closest(".story-panel");
    if (panel) selectStory(panel.id);
    let ancestor = target;
    while (ancestor && ancestor !== document.body) {
      if (ancestor.tagName === "DETAILS") setDisclosure(ancestor, true);
      ancestor = ancestor.parentElement;
    }
    target.scrollIntoView();
  }
  window.addEventListener("hashchange",openHashTarget);
  if (location.hash) requestAnimationFrame(openHashTarget);
  let framePending = false;
  function updateReadingState() {
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    document.querySelector(".reading-line").style.width = (limit > 0 ? Math.min(100,window.scrollY / limit * 100) : 0) + "%";
    let active = "experience";
    sectionIds.forEach(id => {
      if (document.getElementById(id).getBoundingClientRect().top <= window.innerHeight * .36) active = id;
    });
    document.querySelectorAll("[data-section-link]").forEach(link => {
      const current = link.dataset.sectionLink === active;
      link.classList.toggle("active",current);
      if (current) link.setAttribute("aria-current","location");
      else link.removeAttribute("aria-current");
    });
    framePending = false;
  }
  function scheduleReadingUpdate() {
    if (!framePending) { framePending = true; requestAnimationFrame(updateReadingState); }
  }
  window.addEventListener("scroll",scheduleReadingUpdate,{passive:true});
  window.addEventListener("resize",scheduleReadingUpdate);
  updateReadingState();
  let printState = [];
  window.addEventListener("beforeprint",() => {
    settlePreviewMotion();
    if (preview.open) closeProjectPreview(true);
    printState = Array.from(document.querySelectorAll("details")).map(d => [d,d.open]);
    printState.forEach(([d]) => setDisclosure(d, true));
  });
  window.addEventListener("afterprint",() => printState.forEach(([d,open]) => { d.open = open; }));
})();
