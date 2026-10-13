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
  // Typeset both translations before measuring layouts; cloned project bodies
  // retain their rendered math. Explicit delimiters leave currency text alone.
  const typesetMath = root => {
    if (typeof window.renderMathInElement !== "function") return;
    window.renderMathInElement(root, {
      delimiters:[
        {left:"$$",right:"$$",display:true},
        {left:"\\[",right:"\\]",display:true},
        {left:"\\(",right:"\\)",display:false}
      ],
      ignoredClasses:["katex"],
      throwOnError:false,
      trust:false,
      output:"htmlAndMathml"
    });
  };
  const renderEquation = (title, formula, note) => '<figure class="paper-equation"><figcaption>' +
    bi(title) + '</figcaption><div class="math-scroll" role="region" tabindex="0" aria-label="' +
    escapeHTML(title.en) + '">' + escapeHTML("\\[" + formula + "\\]") + '</div><p>' + bi(note) + '</p></figure>';
  const arrow = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const diagonal = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M6 18 18 6M6 6h12v12"/></svg>';
  const up = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M12 19V5M6 11l6-6 6 6"/></svg>';
  const dot = '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/></svg>';
  const tagLogos = {
    Python:"python",PyTorch:"pytorch",TensorFlow:"tensorflow",Transformers:"huggingface",
    Qwen3:"qwen","Qwen3-4B":"qwen",Codex:"openai"
  };
  const tags = values => '<div class="tag-list">' + values.map(v => {
    const logo = tagLogos[typeof v === "object" ? v.en : v];
    return '<span class="tag">' + (logo ? '<img class="tag-logo" src="assets/logos/skills/' + logo +
      '.svg" alt="" width="16" height="16" loading="lazy" decoding="async">' : '') + bi(v,true) + '</span>';
  }).join('') + '</div>';
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
  const renderPaperFigure = figure => {
    const label = figure.redrawn ? "METHOD SCHEMATIC" : "FIGURE " + figure.number;
    return '<figure class="paper-figure"><figcaption><span class="paper-figure-number">' + label +
      '</span><strong>' + bi(figure.title) + '</strong></figcaption><a class="paper-figure-image" href="' +
      escapeHTML(figure.src) + '" target="_blank" rel="noopener noreferrer" aria-label="Enlarge ' + escapeHTML(figure.title.en) + '">' +
      '<img src="' + escapeHTML(figure.src) + '" alt="' + label + ': ' + escapeHTML(figure.title.en) +
      '" width="' + figure.width + '" height="' + figure.height + '" loading="lazy" decoding="async"></a><p>' + bi(figure.note) +
      '</p><a class="paper-zoom" href="' + escapeHTML(figure.src) + '" target="_blank" rel="noopener noreferrer">' +
      bi(figure.redrawn ? T("放大结构图", "Enlarge schematic") : T("查看原图", "View original figure"),true) + diagonal + '</a></figure>';
  };
  const renderResearchTable = (table,group) => {
    const cell = value => value === null ? "OOM" : typeof value !== "number" ? bi(value,true) :
      table.format === "ratio" ? (value*100).toFixed(3) + "%" : table.format === "percent" ? value.toFixed(2) + "%" :
      table.format === "decimal" ? value.toFixed(3) : String(value);
    return '<div class="paper-table-scroll" role="region" tabindex="0" aria-label="' + escapeHTML(table.title.en) + '">' +
      '<table class="paper-result-table"><caption>' + bi(table.title) + '</caption><thead><tr>' +
      table.headers.map(header => '<th scope="col">' + bi(header,true) + '</th>').join('') + '</tr></thead><tbody>' +
      group.rows.map((row,i) => '<tr' + (!i && table.highlight !== false ? ' class="paper-best-row"' : '') +
        '><th scope="row">' + bi(row[0],true) + '</th>' + row.slice(1).map(value => '<td>' + cell(value) + '</td>').join('') +
        '</tr>').join('') + '</tbody></table></div>';
  };
  const renderResearchResults = study => '<div class="research-results"><div class="paper-result-summary">' +
    study.summary.map(item => '<div><span>' + bi(item.label,true) + '</span><strong>' + item.value + '</strong><p>' + bi(item.note) + '</p></div>').join('') +
    '</div><p class="table-note research-source-note">' + bi(study.sourceNote) + '</p><p class="paper-scroll-hint">' +
    bi(T("表格可横向滑动，查看全部条件", "Scroll tables horizontally to see every condition")) + '</p>' +
    study.tables.map(table => {
      const body = table.groups.map(group => '<section class="paper-dataset">' + (group.label ? '<h5>' + bi(group.label,true) + '</h5>' : '') +
        renderResearchTable(table,group) + '</section>').join('') + '<p class="table-note">' + bi(table.note) + '</p>';
      return table.collapsed ? '<details class="paper-evidence"><summary>' + bi(table.title,true) + toggle() +
        '</summary><div class="paper-disclosure-body">' + body + '</div></details>' : '<section class="research-table-section">' + body + '</section>';
    }).join('') + '</div>';
  const renderPaperTable = (rows, title) => '<div class="paper-table-scroll" tabindex="0" role="region" aria-label="' +
    escapeHTML(title.en) + '"><table class="paper-result-table"><caption>' + bi(title) + '</caption><thead><tr><th scope="col">' +
    bi(T("模型 / 配置", "Model / setup"),true) + '</th><th scope="col">wMAPE ↓</th><th scope="col">MAPE ↓</th>' +
    '<th scope="col">SC ↑</th><th scope="col">WSC ↑</th></tr></thead><tbody>' + rows.map((row,i) =>
      '<tr' + (!i ? ' class="paper-best-row"' : '') + '><th scope="row">' + escapeHTML(row[0]) + '</th>' +
      [row[2],row[1],row[3],row[4]].map(value => '<td>' + value.toFixed(3) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const renderPaperResults = study => '<div class="paper-results"><div class="paper-result-summary">' + study.datasets.map(dataset => {
    const method = dataset.comparison[0], baseline = dataset.comparison[1];
    return '<div><span>' + dataset.name + ' · ' + dataset.items.toLocaleString("en") + '</span><strong>−' +
      ((baseline[2]-method[2])/baseline[2]*100).toFixed(1) + '%</strong><p>' + bi(T("wMAPE 相对下降", "Relative wMAPE reduction")) +
      '</p><div class="paper-coverage-gain">WSC +' + ((method[4]-baseline[4])*100).toFixed(1) + ' ' +
      bi(T("个百分点", "pp"),true) + '</div></div>';
  }).join('') + '</div><p class="table-note">' + bi(T("相对 PatchTST · 论文离线实验；WSC 增益以百分点表示", "Versus PatchTST · Offline paper experiments; WSC gains are percentage points")) +
    '</p><div class="paper-metric-key"><p>' + bi(T("MAPE / wMAPE：误差越低越好；SC：达标样本占比；WSC：销量加权的达标样本占比", "MAPE / wMAPE: lower error is better. SC: accepted-sample coverage. WSC: sales-weighted accepted-sample coverage")) +
    '</p><p>' + bi(T("论文以样本 wMAPE ≤ 0.4 判定达标。下表的 SC / WSC 保留论文的 0–1 数值", "The paper uses sample wMAPE ≤ 0.4 as its acceptance criterion. SC / WSC below retain the paper’s 0–1 values")) +
    '</p></div><p class="paper-scroll-hint">' + bi(T("表格可横向滑动，查看全部指标", "Scroll tables horizontally to see all metrics")) + '</p>' +
    study.datasets.map(dataset => '<section class="paper-dataset"><h5>' + dataset.name + ' · ' +
      bi(T("约 " + dataset.items.toLocaleString("en") + " 件商品", "~" + dataset.items.toLocaleString("en") + " products"),true) + '</h5>' +
      renderPaperTable(dataset.comparison,T("Table 2 · 完整模型对照", "Table 2 · Full model comparison")) +
      '<details class="paper-ablation"><summary>' + bi(T("Table 1 · 查看模块消融", "Table 1 · View module ablations"),true) + toggle() + '</summary><div class="paper-disclosure-body">' +
      renderPaperTable(dataset.ablation,T("Table 1 · 模块消融", "Table 1 · Module ablations")) + '<p class="table-note">' +
      bi(T("De-corr：去相关 Tokenization；De-auto：去自回归目标与多任务训练；移除两者即 PatchTST", "De-corr: decorrelative tokenization. De-auto: de-autoregressive targets and multi-task training. Removing both gives PatchTST")) +
      '</p></div></details></section>').join('') + '<details class="paper-evidence"><summary>' +
    bi(T("查看表征机制实验 · Figures 1、5–7", "Representation experiments · Figures 1, 5–7"),true) + toggle() +
    '</summary><div class="paper-disclosure-body">' + ["diagnosis","rank","similarity","acf"].map(key => renderPaperFigure(study.figures[key])).join('') +
    '</div></details></div>';
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
      tab: T("机制研究", "DEFormer"), title: T("两个模块，连接输入与训练目标", "Two modules connect inputs and training targets"),
      challenge: T("De-correlative Tokenization + De-autoregressive Multi-task Training", "De-correlative Tokenization + De-autoregressive Multi-task Training"),
      render: () => diagramFlow([
        ["scope",T("去相关输入", "Decorrelative inputs"),T("原序列 + 一阶差分", "Raw values + first differences")],
        ["graph",T("Patch-wise Transformer", "Patch-wise Transformer"),T("表征与注意力", "Representations & attention")],
        ["decision",T("去自回归训练", "De-autoregressive training"),T("Log-return · MMoE · 双任务", "Log-return · MMoE · Dual tasks")]
      ]) + '<div class="paper-methods">' + renderPaperFigure(deformerStudy.figures.tokenization) +
        renderEquation(T("原序列与差分的双路表达", "Raw and differenced representations"),
          String.raw`\begin{aligned}\Delta X_t &= X_t-X_{t-1}\\[6pt]Z &= \phi(X)W+\phi(\Delta X)W_d\end{aligned}`,
          T(String.raw`\(\phi\) 为缩放后的带符号对数变换；\(W\)、\(W_d\) 是两路独立的线性投影`,
            String.raw`\(\phi\) is the signed-log transform after scaling; \(W\) and \(W_d\) are independent linear projections`)) +
        renderPaperFigure(deformerStudy.figures.multitask) +
        renderEquation(T("目标变换与多任务训练", "Target transform and multi-task training"),
          String.raw`\begin{aligned}Y_{\ln} &= \ln\!\left(1+\frac{Y}{X_L}\right)\\[8pt]\mathcal{L} &= \mathcal{L}_{\mathrm{reg}}+\beta\mathcal{L}_{\mathrm{cla}}\end{aligned}`,
          T(String.raw`\(X_L\) 是最后一个历史值；\(\beta\) 控制辅助分类损失的权重。回归使用 MSE，分类使用 Focal Loss`,
            String.raw`\(X_L\) is the final historical value; \(\beta\) weights the auxiliary classification loss. Regression uses MSE and classification uses Focal Loss`)) + '</div>',
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
      tab:T("联邦预测", "Federated"),title:T("图特征协作，时间模型个性化", "Collaborative graph features, personalized temporal models"),
      challenge:T("本地 GIN + SiDGI + 部分参数联邦 CPLF", "Local GIN + SiDGI + Partial-parameter CPLF"),
      render: () => diagramFlow([
        ["local",T("本地数据", "Local data"),T("原始数据不出域", "Raw data stays local")],
        ["graph",T("SiDGI 特征图", "SiDGI feature graph"),T("学结构 · 校准边权", "Learn edges · Calibrate weights")],
        ["people",T("CPLF 聚合", "CPLF aggregation"),T("共享空间 · 保留时间", "Share spatial · Retain temporal")]
      ]) + '<div class="paper-methods">' + windResearchStudy.figures.map(renderPaperFigure).join('') +
        renderEquation(T("从节点嵌入学习有向关系", "Learn directed relations from node embeddings"),
          String.raw`A_{\mathrm{raw}} = \operatorname{PReLU}\!\left(M_1M_2^{\mathsf{T}}-M_2M_1^{\mathsf{T}}\right)`,
          T(String.raw`\(M_1\)、\(M_2\) 是两组节点嵌入的线性映射；再通过 top-k 稀疏化与 GAT 校准边权`,
            String.raw`\(M_1\) and \(M_2\) are linear mappings of two node embeddings. Top-k sparsification and GAT then refine the edges`)) + '</div>' +
        paperResult("IEEE Transactions on Network Science and Engineering", "2025", T("共同第一作者", "Co-first author")),
      takeaway:T("预测表现、隐私与通信开销，需要共同权衡", "Balance forecasting, privacy and communication together")
    },
    "hust-price": {
      tab:T("电价区间", "Intervals"),title:T("既预测数值，也表达不确定性", "Predict the value and express uncertainty"),
      challenge:T("时间依赖、特征权重与回归损失分别设计", "Design temporal features, feature weights and regression losses separately"),
      render: () => '<div class="prediction-diagram"><div class="prediction-input">' + bi(T("时序与动态特征", "Temporal & dynamic features")) +
        '</div><span class="tree-arrow" aria-hidden="true">↓</span><div class="prediction-model"><strong>' + bi(T("端到端预测框架", "End-to-end forecasting")) +
        '</strong><div>' + bi(T("非共享卷积 · GRU · 稠密跳跃注意力", "Non-shared convolution · GRU · Dense skip attention")) +
        '</div></div><div class="prediction-outputs"><div><svg viewBox="0 0 120 32" aria-hidden="true"><path d="M12 16h96"/><circle cx="60" cy="16" r="5"/></svg><strong>' +
        bi(T("点预测", "Point forecast")) + '</strong><span>' + bi(T("预测了多少", "The predicted value")) +
        '</span></div><div><svg viewBox="0 0 120 32" aria-hidden="true"><path d="M12 16h96"/><path class="interval-range" d="M32 16h56"/><path d="M32 10v12m56-12v12"/><circle cx="60" cy="16" r="4"/></svg><strong>' +
        bi(T("区间预测", "Interval forecast")) + '</strong><span>' + bi(T("可能的波动范围", "The plausible range")) +
        '</span></div></div></div><div class="paper-methods">' + priceResearchStudy.figures.map(renderPaperFigure).join('') +
        renderEquation(T("注意力主路与跳跃旁路融合", "Combine attention and skip paths"),
          String.raw`Y_i^{*} = \phi(g_i)+\rho(g_i)`,
          T(String.raw`\(\phi\) 表示特征加权主路，\(\rho\) 表示跳跃旁路；两路相加后进入最终全连接层`,
            String.raw`\(\phi\) is the feature-weighted main path and \(\rho\) is the skip path. Their sum feeds the final fully connected layer`)) + '</div>' +
        paperResult("IEEE Transactions on Power Systems", "2023", T("第二作者", "Second author")),
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
      '</p></header><div class="story-visual">' + visual.render() + '</div><details class="story-notes"><summary class="notes-summary">' + bi(ui.storyNotes,true) + toggle() +
      '</summary><div class="story-body"><div class="story-original-heading"><div class="story-original-title">' + bi(story.title) +
      '</div><p class="story-original-brief">' + bi(story.brief) + '</p></div>' +
    storyBlock(ui.problem, '<p>' + bi(story.problem) + '</p>') +
    storyBlock(ui.action, '<ul class="action-list">' + story.actions.map(a => '<li>' + bi(a) + '</li>').join('') + '</ul>') +
    storyBlock(ui.result, '<div class="result-box">' + bi(story.result) + '</div>') +
    '<div class="story-footer">' + tags(story.stack) + (story.project ?
      '<a class="text-link" href="#' + story.project + '" data-open-project="' + story.project + '" aria-haspopup="dialog" aria-controls="project-preview" aria-expanded="false">' + bi(ui.viewProject, true) + arrow + '</a>' : '') +
    '</div></div></details></article>';
  };
  const renderStoryBoard = exp => '<div class="story-board"><div class="story-tabs" role="tablist" aria-label="' + escapeHTML(exp.company.en) + ' stories">' +
    exp.stories.map((story,i) => '<button type="button" role="tab" id="tab-' + story.id + '" aria-controls="' + story.id +
      '" aria-selected="' + (!i) + '" tabindex="' + (i ? '-1' : '0') + '" data-story-tab="' + story.id + '"><span class="tab-index" aria-hidden="true">0' +
      (i+1) + '</span>' + bi(visualStories[story.id].tab,true) + '</button>').join('') +
    '</div><div class="stories-list">' + exp.stories.map(renderStory).join('') + '</div></div>';
  const institutionLogos = {
    alibaba:{id:"alibaba",src:"assets/logos/alibaba.svg"},
    hust:{id:"hust",src:"assets/logos/hust.png"},
    psl:{id:"psl",src:"assets/logos/psl-icon.svg"},
    wut:{id:"wut",src:"assets/logos/wut-icon.svg"}
  };
  const institutionLogo = (logo,extraClass = "") => '<span class="experience-logo experience-logo--' +
    logo.id + ' ' + extraClass + '"><img src="' + logo.src + '" alt="" width="56" height="56" decoding="async"></span>';
  const experienceLogos = {
    alibaba: [institutionLogos.alibaba],
    innox: [{id:"innox",src:"assets/logos/innox.png"}],
    hust: [institutionLogos.hust,institutionLogos.psl]
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
    '<header class="experience-header' + (experienceLogos[exp.id].length > 1 ? ' experience-header--joint' : '') +
    '"><span class="experience-logos">' + experienceLogos[exp.id].map(logo => institutionLogo(logo)).join('') + '</span>' +
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
  const projectVisual = project => {
    const cover = projectCovers[project.id];
    const img = src => '<img src="' + escapeHTML(src) + '" alt="" width="' + cover.width +
      '" height="' + cover.height + '" loading="lazy" decoding="async">';
    const picture = typeof cover.src === "string" ? img(cover.src) : '<span class="bi project-cover-translations">' +
      '<span class="zh" lang="zh-CN">' + img(cover.src.zh) + '</span><span class="en" lang="en">' + img(cover.src.en) + '</span></span>';
    return '<span class="project-visual" aria-hidden="true">' + picture + '</span>';
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
    '</h4>' + (project.researchStudy ? renderResearchResults(project.researchStudy) : project.paperStudy ? renderPaperResults(project.paperStudy) : project.table && !project.visualStory ? renderTable(project.table) : '') +
    (project.metrics ? renderMetrics(project.metrics) : '') + '<p class="project-outcome">' + bi(project.outcome) + '</p>' +
    '<div class="project-footer">' + tags(project.tags) + (project.related ?
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
    '<div class="skill-group skill-group--language"><h3>' + bi(T("语言能力", "Languages")) + '</h3>' +
    tags([data.language]) + '</div></div></section>' +
    '<section class="section" id="education">' + heading(4,ui.educationTitle,ui.educationDesc) +
    '<div class="education-list">' + data.education.map(ed => '<div class="education-row"><div class="education-school">' +
      institutionLogo(institutionLogos[ed.id],"education-logo") + '<div class="education-copy"><h3>' + bi(ed.name) +
      '</h3><p>' + bi(ed.degree) + '</p>' + (ed.note ? '<div class="education-note">' + bi(ed.note) + '</div>' : '') +
      '</div></div><span class="date">' + ed.date + '</span></div>').join('') + '</div>' +
    '<div class="papers"><div class="papers-header"><h3>' + bi(ui.selectedPapers) +
    '</h3><a class="text-link" href="' + data.scholar + '" target="_blank" rel="noopener noreferrer">' + bi(ui.allPapers,true) +
    diagonal + '</a></div><div class="paper-list">' + data.papers.map(paper =>
      '<div class="paper"><div class="paper-title">' + escapeHTML(paper.title) + '</div><div class="paper-venue">' +
      bi(paper.venue) + '</div></div>').join('') + '</div><p class="honors">' + bi(data.honors) + '</p></div></section>' +
    '<div class="bottom-bar"><span>' + bi(ui.source) + '</span><a href="#top">© 2026 Jason Ding' + up + '</a></div></main></div></div>';
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
  typesetMath(document.getElementById("app"));
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
      typesetMath(preview);
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
