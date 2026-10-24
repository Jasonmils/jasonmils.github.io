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
    Qwen3:"qwen","Qwen3-4B":"qwen","Qwen3-27B":"qwen","Qwen3.5-35B-A3B":"qwen","Qwen3-ASR":"qwen",Codex:"openai",
    Gemini:"googlegemini",DeepSeek:"deepseek"
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
    '<a href="#' + id + '" data-section-link="' + id + '" data-section-slot="' + i + '">' +
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
  const renderWikiFigure = figure => '<figure class="paper-figure system-figure"><figcaption><span class="paper-figure-number">' +
    figure.label + '</span><strong>' + bi(figure.title) + '</strong></figcaption><div class="bi system-figure-translations">' +
    ["zh","en"].map(lang => '<span class="' + lang + '" lang="' + (lang === "zh" ? "zh-CN" : "en") + '"><a class="paper-figure-image" href="' +
      escapeHTML(figure.src[lang]) + '" target="_blank" rel="noopener noreferrer"><img src="' + escapeHTML(figure.src[lang]) +
      '" alt="' + escapeHTML(figure.title[lang]) + '" width="' + figure.width + '" height="' + figure.height +
      '" loading="lazy" decoding="async"></a><a class="paper-zoom" href="' + escapeHTML(figure.src[lang]) +
      '" target="_blank" rel="noopener noreferrer">' + (lang === "zh" ? "放大流程图" : "Enlarge diagram") + diagonal + '</a></span>').join('') +
    '</div><p>' + bi(figure.note) + '</p></figure>';
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
  const renderResearchTables = (study,indices,collapsed) => indices.map(index => {
    const table = study.tables[index];
    const body = table.groups.map(group => '<section class="paper-dataset">' + (group.label ? '<h6>' + bi(group.label,true) + '</h6>' : '') +
      renderResearchTable(table,group) + '</section>').join('') + '<p class="table-note">' + bi(table.note) + '</p>';
    return collapsed ? '<details class="paper-evidence"><summary>' + bi(table.title,true) + toggle() +
      '</summary><div class="paper-disclosure-body">' + body + '</div></details>' : '<section class="research-table-section">' + body + '</section>';
  }).join('');
  const renderResearchResults = study => '<div class="research-results' + (study.kind === "review" ? ' review-results' : '') + '"><p>' +
    bi(study.narrative.resultIntro) + '</p><div class="paper-result-summary">' +
    study.summary.map(item => '<div><span>' + bi(item.label,true) + '</span><strong>' + item.value + '</strong><p>' + bi(item.note) + '</p></div>').join('') +
    '</div><p class="table-note research-source-note">' + bi(study.sourceNote) + '</p>' +
    (study.paperURL ? '<a class="paper-zoom" href="' + escapeHTML(study.paperURL) + '" target="_blank" rel="noopener noreferrer">' +
      bi(T("阅读发表论文", "Read the published paper"),true) + diagonal + '</a>' : '') + '<p class="paper-scroll-hint">' +
    bi(T("表格可横向滑动，查看全部条件", "Scroll tables horizontally to see every condition")) + '</p>' +
    study.narrative.resultBlocks.map(block => '<div class="research-result-block"><h5 class="research-result-heading">' + bi(block.title) +
      '</h5><p>' + bi(block.body) + '</p>' + renderResearchTables(study,block.tables,block.collapsed) + '</div>').join('') +
    (study.outlook ? '<section class="review-outlook"><h5 class="research-result-heading">' +
      bi(T("未来方向：论文提出了哪些待探索问题？", "Future directions: which questions remain open?")) + '</h5><div class="review-outlook-grid">' +
      study.outlook.map(item => '<article><h5>' + bi(item.title) + '</h5><p>' + bi(item.body) + '</p></article>').join('') +
      '</div></section>' : '') + '</div>';
  const renderWikiResults = study => '<div class="wiki-results"><div class="wiki-output-grid">' +
    study.outputs.map(item => '<article><h5>' + bi(item.title) + '</h5><p>' + bi(item.body) + '</p></article>').join('') +
    '</div><p class="paper-scroll-hint">' + bi(T("表格可横向滑动，查看完整验收条件", "Scroll horizontally to read every acceptance condition")) + '</p>' +
    renderResearchTable(study.table,study.table.groups[0]) + '<p class="table-note research-source-note">' + bi(study.evidenceNote) + '</p></div>';
  const renderPaperTable = (rows, title) => '<div class="paper-table-scroll" tabindex="0" role="region" aria-label="' +
    escapeHTML(title.en) + '"><table class="paper-result-table"><caption>' + bi(title) + '</caption><thead><tr><th scope="col">' +
    bi(T("模型 / 配置", "Model / setup"),true) + '</th><th scope="col">wMAPE ↓</th><th scope="col">MAPE ↓</th>' +
    '<th scope="col">SC ↑</th><th scope="col">WSC ↑</th></tr></thead><tbody>' + rows.map((row,i) =>
      '<tr' + (!i ? ' class="paper-best-row"' : '') + '><th scope="row">' + escapeHTML(row[0]) + '</th>' +
      [row[2],row[1],row[3],row[4]].map(value => '<td>' + value.toFixed(3) + '</td>').join('') + '</tr>').join('') + '</tbody></table></div>';
  const renderPaperResults = study => '<div class="paper-results"><h5 class="research-result-heading">' +
    bi(study.narrative.resultHeadings[0]) + '</h5><div class="paper-result-summary">' + study.datasets.map(dataset => {
    const method = dataset.comparison[0], baseline = dataset.comparison[1];
    return '<div><span>' + dataset.name + ' · ' + dataset.items.toLocaleString("en") + '</span><strong>−' +
      ((baseline[2]-method[2])/baseline[2]*100).toFixed(1) + '%</strong><p>' + bi(T("wMAPE 相对下降", "Relative wMAPE reduction")) +
      '</p><div class="paper-coverage-gain">WSC +' + ((method[4]-baseline[4])*100).toFixed(1) + ' ' +
      bi(T("个百分点", "pp"),true) + '</div></div>';
  }).join('') + '</div><p class="table-note">' + bi(T("相对 PatchTST · 论文离线实验；WSC 增益以百分点表示", "Versus PatchTST · Offline paper experiments; WSC gains are percentage points")) +
    '</p><div class="paper-metric-key"><p>' + bi(T("MAPE / wMAPE：误差越低越好；SC：达标样本占比；WSC：销量加权的达标样本占比", "MAPE / wMAPE: lower error is better. SC: accepted-sample coverage. WSC: sales-weighted accepted-sample coverage")) +
    '</p><p>' + bi(T("论文以样本 wMAPE ≤ 0.4 判定达标。下表的 SC / WSC 保留论文的 0–1 数值", "The paper uses sample wMAPE ≤ 0.4 as its acceptance criterion. SC / WSC below retain the paper’s 0–1 values")) +
    '</p></div><details class="paper-evidence"><summary>' + bi(study.narrative.fullTables,true) + toggle() +
    '</summary><div class="paper-disclosure-body"><p class="paper-scroll-hint">' +
    bi(T("表格可横向滑动，查看全部指标", "Scroll tables horizontally to see all metrics")) + '</p>' +
    study.datasets.map(dataset => '<section class="paper-dataset"><h6>' + dataset.name + ' · ' +
      bi(T("约 " + dataset.items.toLocaleString("en") + " 件商品", "~" + dataset.items.toLocaleString("en") + " products"),true) + '</h6>' +
      renderPaperTable(dataset.comparison,T("Table 2 · 完整模型对照", "Table 2 · Full model comparison")) + '</section>').join('') +
    '</div></details><h5 class="research-result-heading">' + bi(study.narrative.resultHeadings[1]) + '</h5><p>' + bi(study.narrative.ablation) +
    '</p><p class="table-note">' +
      bi(T("De-corr：去相关 Tokenization；De-auto：去自回归目标与多任务训练；移除两者即 PatchTST", "De-corr: decorrelative tokenization. De-auto: de-autoregressive targets and multi-task training. Removing both gives PatchTST")) +
      '</p>' + study.datasets.map(dataset => '<section class="paper-dataset"><h6>' + dataset.name + ' · ' +
      bi(T("约 " + dataset.items.toLocaleString("en") + " 件商品", "~" + dataset.items.toLocaleString("en") + " products"),true) +
      '</h6>' + renderPaperTable(dataset.ablation,T("Table 1 · 模块消融", "Table 1 · Module ablations")) + '</section>').join('') +
    '<h5 class="research-result-heading">' + bi(study.narrative.resultHeadings[2]) + '</h5><p>' + bi(study.narrative.mechanism) +
    '</p>' + renderDeformerFigure("rank") + '<details class="paper-evidence"><summary>' +
    bi(T("展开 Token 相似度与 ACF 分布验证 · 图 6–7", "Expand token similarity and ACF comparisons · Figures 6–7"),true) + toggle() +
    '</summary><div class="paper-disclosure-body">' + ["similarity","acf"].map(renderDeformerFigure).join('') + '</div></details></div>';
  const paperResult = (venue, year, authorship) => '<div class="paper-result"><span class="paper-result-year">' + year +
    '</span><div><strong>' + escapeHTML(venue) + '</strong><span>' + bi(authorship) + '</span></div></div>';
  const renderGrowthAB = (compact = false) => '<div class="ab-results' + (compact ? ' ab-results--compact' : '') + '">' +
    productGrowthABResults.phases.map(phase => '<article class="ab-phase"><div class="phase-label">' + bi(phase.label) +
      '</div><h5 class="ab-treatment">' + bi(phase.treatment) + '</h5><p class="ab-control">' +
      bi(T("对照：" + phase.control.zh, "Control: " + phase.control.en)) + '</p><p class="ab-planning">' + bi(phase.planning) +
      '</p><div class="ab-measures"><div><div class="adoption-value">' + phase.adoption + '<span>%</span></div><div class="chart-label">' +
      bi(T("建议采纳率", "Recommendation adoption")) + '</div><div class="adoption-track" aria-hidden="true"><span style="width:' +
      phase.adoption + '%"></span></div></div><div class="gmv-result"><strong>' + phase.growth + '%</strong><span>' +
      bi(T("GMV 增幅较该期对照组高", "Higher GMV growth than this phase’s control")) + '</span></div></div></article>'
    ).join('') + '</div>';
  const renderForecastRoadmap = () => {
    const node = key => {
      const step = qwenOptimizationSteps[key];
      return '<li><button type="button" class="forecast-node" data-forecast-step="' + key + '" aria-pressed="' +
        (key === "deformer") + '"><span class="forecast-node-code">' + step.code + '</span><strong>' + bi(step.title) +
        '</strong><span class="forecast-node-caption">' + bi(step.caption) + '</span></button></li>';
    };
    return '<div class="forecast-roadmap"><div class="forecast-map-toolbar"><button type="button" data-forecast-enlarge>' +
      bi(T("放大路线图", "Enlarge roadmap"),true) + diagonal + '</button></div><div class="forecast-lane forecast-lane--upstream"><div class="forecast-lane-heading"><h5>' +
      bi(T("主线 B · Qwen3 后训练", "Track B · Qwen3 post-training")) + '</h5><span>' +
      bi(T("任务推理与表征", "Task reasoning & features")) + '</span></div><ol class="forecast-nodes forecast-nodes--upstream">' +
      ["sft","rlvr","opd"].map(node).join('') + '</ol></div>' +
      '<div class="forecast-transfer"><svg viewBox="0 0 100 52" preserveAspectRatio="none" aria-hidden="true">' +
      '<path d="M16.7 0V10Q16.7 15 23 15H56.5Q62.5 15 62.5 22M50 0V15M83.3 0V10Q83.3 15 77 15H62.5M62.5 42V50"/>' +
      '</svg><span>' + bi(T("各阶段 embedding → 融合 + 下游重训", "Each stage’s embeddings → Fusion + downstream retraining")) +
      '</span><i aria-hidden="true"></i></div>' +
      '<div class="forecast-lane forecast-lane--downstream"><div class="forecast-lane-heading"><h5>' +
      bi(T("主线 A · DEFormer 价量预估", "Track A · DEFormer price–sales forecasting")) + '</h5><span>' +
      bi(T("wMAPE ↓ · 稳定性 ↑", "wMAPE ↓ · Stability ↑")) + '</span></div><ol class="forecast-nodes forecast-nodes--downstream">' +
      ["deformer","frozen","adapted","stability"].map(node).join('') + '</ol></div>' +
      '<div class="forecast-legend"><span class="forecast-legend-evolution">' + bi(T("模型优化路径", "Model optimization")) +
      '</span><span class="forecast-legend-transfer">' + bi(T("表征供给下游", "Features to downstream")) + '</span></div>' +
      '<p class="forecast-reading-guide">' + bi(T("从 A1、A2 起讲 → 转到 B1–B3 → 回到 A3 验证、A4 稳定性", "Start at A1–A2 → Follow B1–B3 → Return to A3 validation and A4 stability")) + '</p>' +
      '<p class="forecast-interaction-hint">' + bi(T("点击节点，查看改动与验证", "Select a node for the change and its validation")) + '</p>' +
      '<div class="forecast-step-panels" aria-live="polite">' + Object.entries(qwenOptimizationSteps).map(([key,step]) =>
        '<section class="forecast-step-panel" data-forecast-panel="' + key + '"' + (key === "deformer" ? '' : ' hidden') +
        '><h5><span>' + step.code + '</span>' + bi(step.heading) + '</h5><p>' + bi(step.change) + '</p><p class="forecast-step-evidence">' +
        bi(step.evidence) + '</p>' + (step.link ? '<a class="text-link" href="#project-deformer" data-open-project="project-deformer" aria-controls="project-preview" aria-expanded="false">' +
        bi(T("查看 DEFormer 机制与消融", "Explore DEFormer mechanisms & ablations"),true) + arrow + '</a>' : '') + '</section>'
      ).join('') + '</div></div>';
  };
  const renderAgentWorkflow = () => {
    const node = key => {
      const step = agentWorkflowSteps[key];
      return '<button type="button" class="agent-node agent-node--' + key + '" data-agent-step="' + key +
        '" aria-pressed="' + (key === "planner") + '"><span class="agent-node-top">' + diagramIcon(step.icon) +
        '<span>' + step.label + '</span></span><strong>' + bi(step.title) + '</strong><span class="agent-node-caption">' +
        bi(step.caption) + '</span></button>';
    };
    return '<div class="agent-workflow"><div class="forecast-map-toolbar"><button type="button" data-agent-enlarge>' +
      bi(T("放大流程图", "Enlarge workflow"),true) + diagonal + '</button></div>' +
      '<div class="agent-canvas"><div class="agent-orchestration"><span><i aria-hidden="true"></i>LangGraph</span><strong>' +
      bi(T("批量工作流编排", "Batch workflow orchestration")) + '</strong><span>' +
      bi(T("商品 × 场景 × 轮次", "Product × Scenario × Round")) + '</span></div>' +
      '<div class="agent-graph-main"><svg class="agent-connections" viewBox="0 0 1000 422" preserveAspectRatio="none" aria-hidden="true">' +
      '<g class="agent-context-lines"><path d="M160 100V120Q160 130 170 130H490Q500 130 500 140V145M500 100V145M840 100V120Q840 130 830 130H510Q500 130 500 140"/>' +
      '<path class="agent-arrowhead" d="m495 143 5 7 5-7zM495 108l5-8 5 8z"/></g>' +
      '<g class="agent-output-lines"><path d="M500 272V288Q500 298 490 298H170Q160 298 160 308V317"/>' +
      '<path class="agent-arrowhead" d="m155 315 5 7 5-7z"/></g>' +
      '<g class="agent-feedback-lines"><path d="M1000 372H1010Q1024 372 1024 358V64Q1024 50 1010 50H1005"/>' +
      '<path class="agent-arrowhead" d="m1007 45-7 5 7 5z"/></g></svg>' +
      '<span class="agent-tool-link-label">' + bi(T("调用 / 返回", "Call / Return")) + '</span>' +
      '<div class="agent-resource-row">' + ["signals","forecast","memory"].map(node).join('') + '</div>' +
      '<div class="agent-core-row">' + node("planner") + '</div>' +
      '<div class="agent-action-row">' + ["plan","review","feedback"].map(node).join('') + '</div></div>' +
      '<div class="agent-loop-caption"><span aria-hidden="true">↶</span>' + bi(T("执行反馈 → 更新记忆 → 下一轮规划", "Execution feedback → Update memory → Plan the next round")) + '</div>' +
      '<div class="agent-guardrails">' + diagramIcon("execute") + '<strong>' + bi(T("执行保障", "Safeguards")) + '</strong><span>' +
      bi(T("失败重试 · 流程回退 · 人工监督", "Retry failures · Fall back · Human oversight")) + '</span></div></div>' +
      '<p class="forecast-interaction-hint">' + bi(T("点击节点，查看它在工作流中的职责", "Select a node to explore its role in the workflow")) + '</p>' +
      '<div class="agent-step-panels" aria-live="polite">' + Object.entries(agentWorkflowSteps).map(([key,step]) =>
        '<section class="forecast-step-panel" data-agent-panel="' + key + '"' + (key === "planner" ? '' : ' hidden') +
        '><h5>' + bi(step.heading) + '</h5><p>' + bi(step.body) + '</p><p class="forecast-step-evidence">' +
        bi(step.note) + '</p></section>').join('') + '</div></div>';
  };
  const visualStories = {
    "wiki-system": {
      tab:T("证据工作流", "Evidence workflow"),title:T("从多模态证据到可核对的知识更新", "From multimodal evidence to checkable knowledge updates"),
      challenge:T("原始来源 → 派生产物 → 具名批准 → 正式知识页", "Original sources → Derived artifacts → Exact approval → Canonical pages"),
      render: () => '<div class="paper-methods">' + wikiStudy.figures.map(renderWikiFigure).join('') + '</div>'
    },
    "ali-agent": {
      tab: T("Agent 闭环", "Agent loop"), title: T("运营 Agent · 从规划到反馈闭环", "Operations Agent · From plans to a feedback loop"),
      challenge: T("结合信号、工具与记忆生成规划，经人工审核后执行，再用反馈调整下一轮", "Plan with signals, tools and memory; review before execution, then use feedback in the next round"),
      render: renderAgentWorkflow,
      takeaway: T("把模型输出接入可追踪、可迭代的业务流程", "Turn model outputs into a traceable, repeatable workflow")
    },
    "ali-forecast": {
      tab: T("预测优化", "Forecasting"), title: T("LLM 增强价量预估 · 双线优化路径", "LLM-enhanced forecasting · Two optimization tracks"),
      challenge: T("上游优化推理与表征，下游完成融合、预测与稳定性优化", "Improve reasoning and features upstream; optimize fusion, forecasts and stability downstream"),
      render: renderForecastRoadmap,
      takeaway: T("标签任务的提升，最终要在真实预测任务中成立", "A better label task must translate into better forecasting")
    },
    "ali-deformer": {
      tab: T("机制研究", "DEFormer"), title: T("两个模块，连接输入与训练目标", "Two modules connect inputs and training targets"),
      challenge: T("De-correlative Tokenization + De-autoregressive Multi-task Training", "De-correlative Tokenization + De-autoregressive Multi-task Training"),
      render: () => diagramFlow([
        ["scope",T("去相关输入", "Decorrelative inputs"),T("原序列 + 一阶差分", "Raw values + first differences")],
        ["graph",T("Patch-wise Transformer", "Patch-wise Transformer"),T("表征与注意力", "Representations & attention")],
        ["decision",T("去自回归训练", "De-autoregressive training"),T("log1p · MMoE · 双任务", "log1p · MMoE · Dual tasks")]
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
      tab:T("系统综述", "Review"),title:T("新能源电力系统的 AI 方法与运行任务", "AI methods and operational tasks in renewable power systems"),
      challenge:T("预测 · 调度 · 控制 · 电力市场", "Forecasts · Dispatch · Control · Electricity markets"),
      render: () => diagramFlow([
        ["forecast",T("预测", "Forecasts"),T("发电 · 负荷 · 电价", "Generation · Load · Price")],
        ["decision",T("调度", "Dispatch"),T("潮流 · 成本 · 机组组合", "OPF · Cost · Unit commitment")],
        ["grid",T("控制", "Control"),T("电压 · 频率 · 稳定性", "Voltage · Frequency · Stability")],
        ["people",T("市场", "Markets"),T("竞价 · 出清 · 多方交互", "Bidding · Clearing · Interaction")]
      ],null,true) + '<div class="paper-methods">' + renderPaperFigure(reviewResearchStudy.figures[0]) +
        '<details class="paper-evidence"><summary>' + bi(T("论文原图 · 调度、控制与市场", "Paper figures · Dispatch, control and markets"),true) + toggle() +
        '</summary><div class="paper-disclosure-body">' + reviewResearchStudy.figures.slice(1).map(renderPaperFigure).join('') + '</div></details></div>' +
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
  const renderProductGrowthCurve = () => {
    const title = T("跨档期商品成长：高潜孵化与成长层级防滑落", "Product growth across campaigns: incubation and growth-tier retention");
    const description = T("策略示意。横轴为档期，纵轴为成长层级；从当前商品状态出发，高潜商品进行孵化，有滑落风险的商品进行层级维持。虚线表示滑落风险，图中无实际业务数据", "Strategy illustration. Campaigns are on the horizontal axis and growth tier on the vertical axis. Incubate products with growth potential and retain the tier of products at risk. The dashed path denotes decline risk; no actual business data is plotted");
    const svg = lang => {
      const id = "journey-growth-" + lang;
      const label = (x,y,value,cls,anchor = "start") => '<text x="' + x + '" y="' + y + '" class="' + cls +
        '" text-anchor="' + anchor + '">' + escapeHTML(value[lang]) + '</text>';
      return '<svg class="journey-chart journey-chart--growth" viewBox="0 0 300 186" width="300" height="186" role="img" aria-labelledby="' +
        id + '-title ' + id + '-desc"><title id="' + id + '-title">' + escapeHTML(title[lang]) + '</title><desc id="' + id + '-desc">' +
        escapeHTML(description[lang]) + '</desc><path class="journey-chart-axis" d="M34 32V154H278M30 38l4-6 4 6M272 150l6 4-6 4"/>' +
        '<path class="journey-chart-history" d="M48 125C75 120 100 95 134 94"/>' +
        '<path class="journey-chart-risk" data-path="risk" d="M134 94C176 102 214 128 252 132"/>' +
        '<path class="journey-chart-incubation" data-path="incubation" d="M134 94C176 85 213 56 252 42"/>' +
        '<path class="journey-chart-retention" data-path="retention" d="M134 94C176 91 213 90 252 94"/>' +
        '<circle class="journey-chart-history-point" cx="48" cy="125" r="3"/><circle class="journey-chart-current" cx="134" cy="94" r="4"/>' +
        '<circle class="journey-chart-growth-point" cx="252" cy="42" r="4"/><circle class="journey-chart-retention-point" cx="252" cy="94" r="4"/>' +
        label(34,20,T("成长层级", "Growth tier"),"journey-chart-axis-label") + label(278,178,T("档期", "Campaigns"),"journey-chart-axis-label","end") +
        label(134,176,T("当前", "Now"),"journey-chart-current-label","middle") + label(170,30,T("高潜孵化", "Incubation"),"journey-chart-incubation-label") +
        label(225,79,T("防滑落", "Retain tier"),"journey-chart-retention-label") + label(252,147,T("滑落风险", "Decline risk"),"journey-chart-risk-label","end") + '</svg>';
    };
    return '<span class="agent-plan-growth"><span class="bi"><span class="zh" lang="zh-CN">' + svg("zh") +
      '</span><span class="en" lang="en">' + svg("en") + '</span></span><span class="journey-chart-note">' +
      bi(T("评估 → 运营 → 反馈 · 示意", "Assess → Act → Review · Illustration")) + '</span></span>';
  };
  const renderGrowthDiagram = kind => {
    if (kind === "price") {
      // Illustrative daily forecasts only. GMV is derived from all 14 outputs at each price.
      const dailyProfile = [0.72,0.76,0.68,0.84,0.91,1.06,0.96,0.82,0.78,0.89,1.03,1.18,1.08,1.13];
      const forecast = price => dailyProfile.map(value => value * Math.exp(-0.5 * price * price));
      const predictedGMV = price => price * forecast(price).reduce((sum,value) => sum + value,0);
      const gmv = price => predictedGMV(price) / predictedGMV(1);
      const scenarios = [{price:0.55,label:"p₁",kind:"lower"},{price:1,label:"p*",kind:"selected"},{price:1.55,label:"p₃",kind:"higher"}];
      const priceX = price => 40 + 116 * price;
      const dayX = index => 40 + 232 * index / 13;
      const gmvY = price => 108 - 63 * gmv(price);
      const dailyY = value => 128 - 78 * value;
      const gmvPath = Array.from({length:81}, (_,i) => (i ? "L" : "M") + priceX(i / 40).toFixed(2) + " " + gmvY(i / 40).toFixed(2)).join(" ");
      const svg = (lang,chart) => {
        const isSales = chart === "sales";
        const id = "journey-price-" + chart + "-" + lang;
        const height = isSales ? 160 : 142;
        const label = (x,y,text,cls,anchor = "start") => '<text x="' + x + '" y="' + y + '" class="' + cls + '" text-anchor="' + anchor + '">' + escapeHTML(text) + '</text>';
        const title = isSales ? T("不同候选价格下，未来 14 天每天的销量预测", "Daily sales forecasts for the next 14 days at different candidate prices") :
          T("汇总逐日预测，选择预测 GMV 最大的价格", "Aggregate daily forecasts to select the price with maximum predicted GMV");
        const description = isSales ? T(
          "横轴为未来第 1 至第 14 天，纵轴为每日预测销量。每条曲线对应一个候选价格，并包含 14 个日预测值，模型输出 Y(p) 属于 R14。蓝色曲线为下图最优价格 p* 对应的完整逐日预测序列。曲线及其形状仅为示意，并非普遍规律或实际业务数据",
          "The horizontal axis is future day 1 through day 14; the vertical axis is predicted daily units. Each curve represents a candidate price and contains 14 daily predictions: model output Y(p) is a vector in R14. The blue trajectory is the complete daily forecast at p*, the selected price in the lower chart. The curves and their shapes are illustrative, not universal relationships or actual business data"
        ) : T(
          "横轴为候选价格，纵轴为预测 GMV。模型先为每个价格输出 14 个逐日销量预测；在决策环节，将这 14 个日预测值求和后乘以该价格，得到预测 GMV。曲线峰值对应候选范围内预测 GMV 最高的价格 p*，蓝色峰值与上图蓝色逐日预测曲线对应。此示意中每个候选价格在 14 天内保持不变",
          "The horizontal axis is candidate price; the vertical axis is predicted GMV. The model first outputs 14 daily sales predictions for each price. The decision step sums those daily predictions and multiplies by the price. The peak identifies p*, the price with the highest predicted GMV within the candidate range, matching the blue daily trajectory above. Each candidate price is held constant across the 14 days in this illustration"
        );
        let plot;
        if (isSales) {
          plot = '<path class="journey-chart-axis" d="M30 40V132H284M26 46l4-6 4 6M278 128l6 4-6 4"/>' +
            label(30,16,T("每日预测销量", "Predicted daily units")[lang],"pricing-curve-axis-label") +
            scenarios.map((scenario,index) => {
              const values = forecast(scenario.price);
              const curve = values.map((value,i) => (i ? "L" : "M") + dayX(i).toFixed(2) + " " + dailyY(value).toFixed(2)).join(" ");
              const legendX = 43 + index * 86;
              return '<g class="pricing-scenario pricing-scenario--' + scenario.kind + '" data-price="' + scenario.price + '">' +
                '<path class="pricing-curve-line" data-curve="daily-sales" d="' + curve + '"/>' +
                values.map((value,i) => '<circle class="pricing-daily-point" data-day="' + (i + 1) + '" cx="' + dayX(i).toFixed(2) + '" cy="' + dailyY(value).toFixed(2) + '" r="2.3"/>').join('') +
                '<path class="pricing-curve-line" d="M' + legendX + ' 32h16"/>' + label(legendX + 21,36,scenario.label,"pricing-scenario-label") + '</g>';
            }).join('') +
            [0,6,13].map(index => '<path class="journey-chart-axis" d="M' + dayX(index) + ' 132v4"/>' + label(dayX(index),153,T("第 " + (index + 1) + " 天", "Day " + (index + 1))[lang],"pricing-curve-axis-label","middle")).join('');
        } else {
          plot = '<path class="journey-chart-axis" d="M30 30V113H284M26 36l4-6 4 6M278 109l6 4-6 4"/>' +
            '<path class="pricing-curve-area" d="' + gmvPath + ' L272 113H40Z"/><path class="pricing-curve-guide" d="M156 45V113"/>' +
            '<path class="pricing-curve-line" data-curve="gmv" d="' + gmvPath + '"/>' +
            '<circle class="pricing-curve-halo" cx="156" cy="45" r="8"/><circle class="pricing-curve-point" cx="156" cy="45" r="4"/>' +
            label(30,16,T("预测 GMV", "Predicted GMV")[lang],"pricing-curve-axis-label") +
            label(156,30,T("预测 GMV 最大", "Maximum predicted GMV")[lang],"pricing-curve-maximum","middle") +
            label(156,135,T("最优价格 p*", "Optimal price p*")[lang],"pricing-curve-price","middle") +
            label(284,135,T("价格 p", "Price p")[lang],"pricing-curve-axis-label","end");
        }
        return '<svg class="journey-chart pricing-curve pricing-curve--' + chart + '" viewBox="0 0 300 ' + height + '" width="300" height="' + height + '" role="img" aria-labelledby="' + id + '-title ' + id + '-desc">' +
          '<title id="' + id + '-title">' + escapeHTML(title[lang]) + '</title><desc id="' + id + '-desc">' + escapeHTML(description[lang]) + '</desc>' + plot + '</svg>';
      };
      const chart = kind => '<span class="bi"><span class="zh" lang="zh-CN">' + svg("zh",kind) + '</span><span class="en" lang="en">' + svg("en",kind) + '</span></span>';
      return '<span class="growth-journey-diagram pricing-decision"><span class="pricing-step-label">' + bi(T("01 · 逐日销量预测", "01 · Daily sales forecasting")) +
        '</span><span class="pricing-forecast-output">' + escapeHTML(String.raw`\(\hat{\mathbf Y}(p)\in\mathbb R^{14}\)`) + '</span>' + chart("sales") +
        '<span class="pricing-formula"><span class="pricing-aggregation-label">' + bi(T("决策时汇总 14 个日预测值", "Sum the 14 daily predictions for pricing")) + '</span>' +
        escapeHTML(String.raw`\(\widehat{\mathrm{GMV}}(p)=p\sum_{t=1}^{14}\hat y_t(p)\)`) +
        '<span class="pricing-formula-arrow" aria-hidden="true">↓</span></span><span class="pricing-step-label">' + bi(T("02 · GMV 最大化决策", "02 · Maximize predicted GMV")) + '</span>' + chart("gmv") +
        '<strong class="pricing-decision-choice">' + bi(T("选择曲线峰值对应的价格 p*", "Choose p* at the peak of predicted GMV")) +
        '</strong><span class="journey-chart-note">' + bi(T("候选价格范围内的决策示意 · 非实际业务数据", "Decision within the candidate price range · Illustration only")) + '</span></span>';
    }
    const connector = '<span class="agent-plan-connector" aria-hidden="true"></span>';
    // Three campaigns illustrate the planning horizon, not a fixed production schedule.
    return '<span class="growth-journey-diagram agent-plan" role="group" aria-labelledby="agent-plan-title">' +
      renderProductGrowthCurve() + '<span class="agent-plan-brief"><strong>' +
      bi(T("整体运营目标 → 各档期目标", "Overall objective → Cycle goals")) + '</strong><span>' +
      bi(T("价量预测工具 · 商品信号 · 历史记忆", "Forecasting tool · Product signals · Memory")) + '</span></span>' + connector +
      '<span class="agent-plan-loop"><span class="agent-plan-engine"><strong id="agent-plan-title">' +
      bi(T("Agent 生成多档期规划", "Agent plans across cycles")) + '</strong><span class="agent-plan-model">Qwen3.5-35B-A3B</span><span class="agent-plan-orchestration">' +
      bi(T("LangGraph 工作流编排", "LangGraph orchestration")) + '</span></span>' + connector +
      '<span class="agent-plan-campaigns">' + [1,2,3].map(number => '<span class="agent-plan-campaign"><span class="agent-plan-cycle">' +
        bi(T("档期 0" + number, "Cycle 0" + number)) + '</span><strong>' + bi(T("周期目标", "Cycle goal")) +
        '</strong><span class="agent-plan-cycle-arrow" aria-hidden="true">↓</span><span>' + bi(T("运营建议", "Action plan")) + '</span></span>').join('') +
      '</span>' + connector + '<span class="agent-plan-review"><svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="m7 12 3 3 7-7"/><rect x="3" y="3" width="18" height="18" rx="6"/></svg>' +
      bi(T("人工审核 → 执行与反馈", "Human review → Act & observe")) + '</span>' + connector +
      '<span class="agent-plan-memory"><strong>' + bi(T("反馈写入 SKU 记忆", "Feedback → SKU memory")) +
      '</strong><span>' + bi(T("SQL · 更新摘要与运营记录", "SQL · Update summary & history")) +
      '</span><span class="agent-plan-replan">' + bi(T("检索历史反馈，调整下一轮规划", "Retrieve feedback to refine the next plan")) + '</span></span></span>' +
      '<span class="journey-chart-note">' + bi(T("多档期工作流示意 · 人工审核后执行", "Illustrative workflow · Execution after human review")) + '</span></span>';
  };
  const renderGrowthJourney = journey => '<nav class="growth-journey" aria-labelledby="' + escapeHTML(journey.stages[0].target) +
    '-journey-label"><p class="growth-journey-label" id="' + escapeHTML(journey.stages[0].target) + '-journey-label">' + bi(journey.label) + '</p><div class="growth-journey-route"><ol class="growth-journey-stages">' +
    journey.stages.map((stage,i) => '<li>' + (i ? '<span class="growth-journey-direction" aria-hidden="true">' + arrow + '</span>' : '') + '<a class="growth-journey-stage growth-journey-stage--' + (i ? 'long' : 'short') + '" href="#' +
      escapeHTML(stage.target) + '"><span class="growth-journey-top"><span class="growth-journey-number" aria-hidden="true">' + stage.number +
      '</span><span class="growth-journey-horizon">' + bi(stage.horizon) + '</span></span><strong>' + bi(stage.title) +
      '</strong><span class="growth-journey-action">' + bi(stage.action) + '</span>' + (stage.diagram ? renderGrowthDiagram(stage.diagram) : '') + '<span class="growth-journey-link">' +
      bi(T("查看阶段", "Explore stage"),true) + arrow + '</span></a></li>').join('') +
    '</ol></div><div class="growth-journey-foundation">' +
    '<svg class="icon" aria-hidden="true" viewBox="0 0 24 24"><path d="M5 8h11l-3-3M19 16H8l3 3M19 8v4M5 16v-4"/></svg><div><strong>' +
    bi(journey.connection) + '</strong><p>' + bi(journey.detail) + '</p></div></div></nav>';
  const renderStrategy = strategy => '<div class="experience-strategy' + (strategy.journey ? ' growth-detail' : '') + '"><h4 class="strategy-title">' + bi(strategy.title) +
    '</h4>' + (strategy.journey ? renderGrowthJourney(strategy.journey) : '') + '<div class="strategy-phases">' + strategy.phases.map((phase, i) =>
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
      '<div class="strategy-impact"><strong>' + bi(phase.result) + '</strong>' +
      (phase.resultTable ? renderTable(phase.resultTable) : '<p>' + bi(phase.resultNote) + '</p>') + '</div></section>'
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
  const renderTable = table => table.phases ? renderGrowthAB(true) + visualNote(table.note) : '<div class="table-wrap"><table class="result-table"><thead><tr>' +
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
  const renderResearchSection = (info,index,body,alias = "") => '<section class="research-section"' +
    (alias ? ' id="' + escapeHTML(alias) + '"' : '') + ' data-preview-anchor="' + info.key + '"><header class="research-section-header"><span class="research-section-number">0' +
    (index+1) + '</span><div><p class="research-section-label">' + bi(info.title) + '</p><h4>' + bi(info.heading) + '</h4></div></header>' + body + '</section>';
  const renderGuidedResearchFigure = (figure,guide,collapsed = false) => {
    const artwork = renderPaperFigure(figure);
    return '<div class="research-evidence"><h5 class="research-figure-question">' + bi(guide.question) +
      '</h5><p class="research-read-guide">' + bi(guide.guide) + '</p>' + (collapsed ? '<details class="paper-evidence"><summary>' +
      bi(T("展开机制原图 · 图 " + figure.number, "Expand mechanism figure · Figure " + figure.number),true) + toggle() +
      '</summary><div class="paper-disclosure-body">' + artwork + '</div></details>' : artwork) +
      '<p class="research-insight">' + bi(guide.insight) + '</p></div>';
  };
  const renderDeformerFigure = key => renderGuidedResearchFigure(deformerStudy.figures[key],deformerStudy.narrative.guides[key]);
  const renderDiagnosticMetrics = metrics => '<section class="diagnostic-metrics"><h5>' + bi(metrics.title) +
    '</h5><p>' + bi(metrics.context) + '</p>' + metrics.cards.map(metric => '<article class="diagnostic-metric">' +
      renderEquation(metric.title,metric.formula,metric.notation) + '<p class="diagnostic-interpretation">' + bi(metric.interpretation) + '</p>' +
      (metric.note ? '<p class="diagnostic-note">' + bi(metric.note) + '</p>' : '') + '</article>').join('') +
    '<p class="research-insight">' + bi(metrics.reading) + '</p></section>';
  const renderResearchEquation = equation => '<details class="paper-evidence research-equations"><summary>' +
    bi(T("展开公式与符号说明", "Expand equations and notation"),true) + toggle() + '</summary><div class="paper-disclosure-body">' +
    renderEquation(equation.title,equation.formula,equation.note) + '</div></details>';
  const renderSubAttention = method => '<article class="research-method subattention-method"><h5>' + bi(method.title) +
    '</h5><p>' + bi(method.intro) + '</p><div class="subattention-equations">' +
    method.equations.map(equation => renderEquation(equation.title,equation.formula,equation.note)).join('') +
    '</div><p class="research-insight">' + bi(method.interpretation) + '</p><p class="subattention-distinction">' +
    bi(method.distinction) + '</p></article>';
  const renderAttentionPhenomenon = figure => '<figure class="paper-figure attention-phenomenon"><figcaption><span class="paper-figure-number">' +
    bi(T("现象示例 · 其他任务", "ILLUSTRATIVE EXAMPLE · OTHER TASK")) + '</span><strong>' + bi(figure.title) +
    '</strong></figcaption><p class="research-read-guide">' + bi(figure.guide) + '</p><div class="attention-panels">' +
    figure.panels.map(panel => '<div class="attention-panel"><h5>' + bi(panel.label) + '</h5><svg viewBox="' + panel.viewBox +
      '" role="img" aria-label="' + escapeHTML(panel.note.en) + '"><image href="' + figure.src + '" width="' + figure.width +
      '" height="' + figure.height + '"></image></svg><p>' + bi(panel.note) + '</p></div>').join('') + '</div><p class="attention-source">' +
    bi(figure.note) + '</p><a class="paper-zoom" href="' + figure.src + '" target="_blank" rel="noopener noreferrer">' +
    bi(T("查看完整原图", "View complete source image"),true) + diagonal + '</a></figure>';
  const renderDeformerBody = project => {
    const story = deformerStudy.narrative;
    const section = (index,body) => renderResearchSection(story.sections[index],index,body,index === 2 ? "ali-deformer" : "");
    const equations = (title,formula,note) => renderResearchEquation({title,formula,note});
    const method = (index,key,equation) => '<article class="research-method"><h5>' + bi(project.decisions[index].title) + '</h5><p>' +
      bi(project.decisions[index].body) + '</p>' + renderDeformerFigure(key) + equation + '</article>';
    return '<div class="project-body deformer-narrative research-narrative">' +
      section(0,'<p>' + bi(story.background) + '</p>') +
      section(1,'<p>' + bi(story.intuition) + '</p>' + renderAttentionPhenomenon(story.phenomenon) + '<p>' + bi(project.challenge) +
        '</p><div class="research-task"><p>' + bi(story.measures) + '</p></div>' + renderDiagnosticMetrics(story.diagnosticMetrics) + renderDeformerFigure("diagnosis")) +
      section(2,'<div class="research-contribution"><p>' + bi(story.contribution) + '</p></div><p>' + bi(story.bridge) + '</p>' +
        method(1,"tokenization",equations(T("原序列与差分的双路表达", "Raw and differenced representations"),
          String.raw`\begin{aligned}\Delta X_t &= X_t-X_{t-1}\\[6pt]Z &= \phi(X)W+\phi(\Delta X)W_d\end{aligned}`,
          T(String.raw`\(\phi\) 为缩放后的带符号对数变换；\(W\)、\(W_d\) 是两路独立的线性投影`,
            String.raw`\(\phi\) is the signed-log transform after scaling; \(W\) and \(W_d\) are independent linear projections`))) +
        renderSubAttention(story.subattention) +
        method(2,"multitask",equations(T("目标变换与多任务训练", "Target transform and multi-task training"),
          String.raw`\begin{aligned}Y_{\ln} &= \ln\!\left(1+\frac{Y}{X_L}\right)\\[8pt]\mathcal{L} &= \mathcal{L}_{\mathrm{reg}}+\beta\mathcal{L}_{\mathrm{cla}}\end{aligned}`,
          T(String.raw`\(X_L\) 是最后一个历史值；\(\beta\) 控制辅助分类损失的权重。回归使用 MSE，分类使用 Focal Loss`,
            String.raw`\(X_L\) is the final historical value; \(\beta\) weights auxiliary classification loss. Regression uses MSE and classification uses Focal Loss`)))) +
      section(3,renderPaperResults(deformerStudy) + '<p class="project-outcome">' + bi(project.outcome) + '</p>') +
      '<div class="project-footer">' + tags(project.tags) + '<a class="text-link" href="#' + project.related + '">' + bi(ui.workLink,true) + arrow + '</a></div></div>';
  };
  const renderResearchBody = project => {
    const study = project.researchStudy, story = study.narrative;
    const section = (index,body) => renderResearchSection(story.sections[index],index,body,index === 2 ? project.sourceStory : "");
    const methods = story.methods.map(method => {
      const decision = project.decisions[method.decision];
      return '<article class="research-method"><h5>' + bi(method.title || decision.title) + '</h5><p>' +
        bi(method.body || decision.body) + '</p>' + (method.figure !== undefined ?
        renderGuidedResearchFigure(study.figures[method.figure],method.guide,method.collapsedFigure) : '') +
        (method.equation ? renderResearchEquation(method.equation) : '') + (method.details ? '<details class="paper-evidence research-method-detail"><summary>' +
        bi(method.details.title,true) + toggle() + '</summary><div class="paper-disclosure-body"><p>' +
        bi(project.decisions[method.details.decision].body) + '</p></div></details>' : '') + '</article>';
    }).join('');
    const publication = story.publication;
    return '<div class="project-body research-narrative">' +
      section(0,'<p>' + bi(story.background) + '</p><div class="research-task"><p>' + bi(story.context) + '</p></div>') +
      section(1,'<div class="research-challenges">' + story.challenges.map(item => '<article><h5>' + bi(item.title) + '</h5><p>' +
        bi(item.body) + '</p></article>').join('') + '</div>') +
      section(2,'<div class="research-contribution"><p>' + bi(story.contribution) + '</p></div><p>' + bi(story.bridge) + '</p>' + methods) +
      section(3,renderResearchResults(study) + '<div class="research-task"><p>' + bi(story.boundary) + '</p></div>' +
        paperResult(publication.venue,publication.year,publication.authorship)) + '<div class="project-footer">' + tags(project.tags) +
      '<a class="text-link" href="#' + project.related + '">' + bi(ui.workLink,true) + arrow + '</a></div></div>';
  };
  const renderProject = project => '<details class="project-card" id="' + project.id + '"><summary class="project-summary">' +
    projectVisual(project) + '<div class="project-heading"><div class="eyebrow">' + bi(project.category) +
    '</div><h3>' + bi(project.title) + '</h3><p>' + bi(project.description) + '</p>' + tags(project.tags.slice(0,3)) + '</div>' + toggle() + '</summary>' +
    renderProjectBody(project) + '</details>';
  const renderProjectBody = project => project.id === "project-deformer" ? renderDeformerBody(project) :
    project.researchStudy?.narrative ? renderResearchBody(project) :
    '<div class="project-body"><div class="project-context"><div><h4 class="small-label">' + bi(ui.context) +
    '</h4><p>' + bi(project.context) +
    '</p></div><div><h4 class="small-label">' + bi(ui.challenge) +
    '</h4><p>' + bi(project.challenge) + '</p></div></div>' +
    (project.visualStories ? project.visualStories.map(id => renderProjectStudy(project,id)).join('') :
      project.visualStory ? renderProjectStudy(project) : '<ol class="flow" aria-label="Workflow">' + project.flow.map((step,i) => '<li class="flow-step"><span class="flow-index">0' +
    (i+1) + '</span>' + bi(step) + '</li>').join('') + '</ol>') +
    '<h4 class="small-label">' + bi(["project-qwen","project-agent"].includes(project.id) ? T("技术细节 · 按需展开", "Technical details · Expand as needed") : ui.decisions) +
    '</h4><div class="decision-list' + (["project-qwen","project-agent"].includes(project.id) ? ' forecast-details' : '') + '">' + project.decisions.map((d,i) =>
      ["project-qwen","project-agent"].includes(project.id) ? '<details class="forecast-detail"><summary>' + bi(d.title,true) + toggle() + '</summary><p>' + bi(d.body) + '</p></details>' :
      '<div class="decision"><span class="number">' + String(i+1).padStart(2,"0") + '</span><div><h4>' + bi(d.title) + '</h4><p>' +
      bi(d.body) + '</p></div></div>').join('') + '</div>' +
    '<h4 class="small-label">' + bi(ui.result) +
    '</h4>' + (project.id === "project-agent" ? renderTable(project.table) : project.wikiStudy ? renderWikiResults(project.wikiStudy) : project.researchStudy ? renderResearchResults(project.researchStudy) : project.paperStudy ? renderPaperResults(project.paperStudy) : project.table && !project.visualStory ? renderTable(project.table) : '') +
    (project.metrics ? renderMetrics(project.metrics) : '') + '<p class="project-outcome">' + bi(project.outcome) + '</p>' +
    '<div class="project-footer">' + tags(project.tags) + (project.related ?
      '<a class="text-link" href="#' + project.related + '">' + bi(ui.workLink, true) + arrow + '</a>' : '') + '</div></div>';
  const renderTechnology = (technology,index) => '<article class="technology-card" id="' + technology.id +
    '" aria-labelledby="' + technology.id + '-title"><header class="technology-card-header"><span class="technology-number" aria-hidden="true">' +
    String(index+1).padStart(2,"0") + '</span><div><h3 id="' + technology.id + '-title">' + escapeHTML(technology.name) +
    '</h3><p>' + bi(technology.title) + '</p></div><span class="technology-icon">' + diagramIcon(technology.icon) + '</span></header>' +
    tags(technology.tags) + '<dl class="technology-work"><div><dt>' + bi(ui.technologyProblem) + '</dt><dd>' +
    bi(technology.problem) + '</dd></div><div><dt>' + bi(ui.technologyContribution) + '</dt><dd>' + bi(technology.contribution) +
    '</dd></div></dl><div class="technology-evidence"><h4>' + bi(ui.technologyEvidence) + '</h4>' +
    (technology.metrics ? renderMetrics(technology.metrics) : '') +
    (technology.resultTable ? renderTable(technology.resultTable) : '<p>' + bi(technology.evidence) + '</p>') + '</div>' +
    '<div class="technology-projects">' + technology.links.map(link => '<a class="contribution-link technology-project-link" href="#' +
      link.target + '" data-open-project="' + link.target + '" aria-controls="project-preview" aria-expanded="false">' +
      '<span class="contribution-copy"><strong>' + bi(link.label) + '</strong><span class="contribution-state"><span class="contribution-idle">' +
      bi(ui.viewProject,true) + '</span><span class="contribution-selected">' + bi(T("正在对照", "In view"),true) +
      '</span></span></span><span class="contribution-arrow" aria-hidden="true">' + arrow + '</span></a>').join('') + '</div></article>';
  const renderTechnologyRoute = () => '<nav class="technology-route" aria-labelledby="technology-route-title"><p id="technology-route-title">' +
    bi(ui.technologyRoute) + '</p><ol>' + data.technologies.map((technology,index) => '<li><a href="#' + technology.id + '"><span aria-hidden="true">' +
    String(index+1).padStart(2,"0") + '</span><strong>' + escapeHTML(technology.name) + '</strong>' + arrow + '</a></li>').join('') + '</ol></nav>';
  const heading = (index, title, description, controls = false, count = false, category = ["EXPERIENCE","PROJECTS","SKILLS","EDUCATION"][index-1]) => '<div class="section-top"><div>' +
    '<div class="eyebrow">0' + index + ' / ' + category +
    '</div><h2 class="section-title">' + bi(title) + '</h2><p class="section-description">' + bi(description) + '</p></div>' +
    (controls ? '<div class="section-controls"><button class="quiet-button" type="button" data-expand-all>' +
      bi(index === 1 ? ui.expandNotes : ui.expandAll, true) + '</button><button class="quiet-button" type="button" data-collapse-all>' +
      bi(index === 1 ? ui.collapseNotes : ui.collapseAll, true) + '</button></div>' : '') +
    (count ? '<span class="project-count">' + bi(ui.projectCount, true) + '</span>' : '') + '</div>';
  document.getElementById("app").innerHTML =
    '<a class="skip-link" href="#main">' + bi(ui.skip, true) + '</a>' +
    '<div class="ambient-light" aria-hidden="true"></div><div class="reading-line" aria-hidden="true"></div>' +
    '<div class="language-dock"><div class="perspective-switch" role="group" aria-label="Portfolio perspective / 浏览视角">' +
    '<button type="button" data-perspective="experience" aria-controls="experience technology" aria-pressed="true">' + bi(ui.experienceView,true) + '</button>' +
    '<button type="button" data-perspective="technology" aria-controls="experience technology" aria-pressed="false">' + bi(ui.technologyView,true) + '</button>' +
    '</div><div class="language-switch" role="group" aria-label="Language / 语言">' +
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
    '<section class="section technology-view" id="technology" hidden>' + heading(1,ui.technologyTitle,ui.technologyDesc,false,false,"AI TECHNOLOGY") +
    renderTechnologyRoute() + '<div class="technology-list">' + data.technologies.map(renderTechnology).join('') + '</div></section>' +
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
    document.querySelector(".perspective-switch").setAttribute("aria-label", ui.perspective[lang]);
    if (persist) { try { localStorage.setItem("jason-portfolio-language",lang); } catch (_) {} }
    const path = persist ? window.portfolioLanguage.pathnameFor(lang) : location.pathname;
    const url = path + location.search + location.hash;
    const state = { ...history.state, portfolioLanguage: lang };
    if (persist && path !== location.pathname) history.pushState(state, "", url);
    else history.replaceState(state, "", url);
    window.portfolioLanguage.syncLinks();
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
    let selected = previewContent.querySelector("[data-preview-anchor]")?.dataset.previewAnchor || "diagram";
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
    const technology = document.body.dataset.perspective === "technology" &&
      data.technologies.find(item => item.id === previewOrigin?.closest(".technology-card")?.id);
    const links = technology ? technology.links : exp?.strategy ? exp.strategy.phases.flatMap(item => item.links) : [{target:project.id,label:project.title}];
    preview.querySelector(".preview-breadcrumb").innerHTML = technology ? escapeHTML(technology.name) :
      bi(exp?.shortCompany || exp?.company || ui.viewProject, true) +
      (phase ? '<span aria-hidden="true">/</span>' + bi(phase.previewLabel || T("阶段 " + phase.number, "Stage " + phase.number),true) : '');
    document.querySelector(".comparison-company").innerHTML = technology ? escapeHTML(technology.name) : bi(exp?.shortCompany || exp?.company || ui.workTitle,true);
    document.querySelector(".comparison-label").innerHTML = bi(technology ? ui.technologyView : T("经历总览", "Experience"),true);
    preview.querySelector(".preview-mobile-projects").innerHTML = links.map(link =>
      '<button type="button" data-preview-project="' + link.target + '" data-preview-view="' + (link.view || '') + '" aria-pressed="' + matchesProject(link) + '">' +
      bi(previewNames[link.view || link.target] || link.label,true) + '</button>').join('');
    document.querySelectorAll("[data-open-project]").forEach(link => {
      const sourceTechnology = link.closest(".technology-card");
      const selected = link.dataset.openProject === project.id && (link.dataset.projectView || "") === view &&
        (!technology || !sourceTechnology || sourceTechnology.id === technology.id);
      link.setAttribute("aria-expanded",String(selected));
      if (selected) link.setAttribute("aria-current","true");
      else link.removeAttribute("aria-current");
    });
  }
  function currentContribution() {
    const matches = link => link.dataset.openProject === preview.dataset.project &&
      (link.dataset.projectView || "") === (preview.dataset.view || "");
    if (previewOrigin?.matches(".contribution-link") && matches(previewOrigin) && previewOrigin.getClientRects().length) return previewOrigin;
    return Array.from(document.querySelectorAll(".contribution-link")).find(link => matches(link) && link.getClientRects().length);
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
    const anchor = source?.closest(".technology-card") || source?.closest(".strategy-phase") || source?.closest(".story-panel") || source;
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
    // Keep the enlarged diagram above the preview while crossing a breakpoint.
    // Apply the preview's new layout after the diagram closes.
    if (document.querySelector(".forecast-dialog[open]")) return;
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
      previewReturnAnchor = origin?.closest(".technology-card") || origin?.closest(".strategy-phase") || origin?.closest(".story-panel") || origin;
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
    // Keep copied IDs and references within the preview consistent.
    const previewIds = new Map();
    body.querySelectorAll("[id]").forEach(element => {
      const original = element.id;
      element.id = "preview-" + original;
      previewIds.set(original,element.id);
    });
    body.querySelectorAll("*").forEach(element => {
      ["aria-labelledby","aria-describedby","aria-controls","aria-owns","aria-activedescendant","for","headers"].forEach(attribute => {
        if (element.hasAttribute(attribute)) element.setAttribute(attribute,
          element.getAttribute(attribute).split(/\s+/).map(id => previewIds.get(id) || id).join(" "));
      });
      ["href","xlink:href"].forEach(attribute => {
        const value = element.getAttribute(attribute);
        if (value?.startsWith("#") && previewIds.has(value.slice(1)))
          element.setAttribute(attribute,"#" + previewIds.get(value.slice(1)));
      });
    });
    const narrative = body.classList.contains("research-narrative");
    if (!narrative) {
      const diagram = body.querySelector(".project-study") || body.querySelector(".flow");
      if (diagram) { body.prepend(diagram); diagram.dataset.previewAnchor = "diagram"; }
      body.querySelector(".project-context").dataset.previewAnchor = "context";
      const decisions = body.querySelector(".decision-list");
      decisions.previousElementSibling.dataset.previewAnchor = "approach";
      decisions.nextElementSibling.dataset.previewAnchor = "results";
    }
    const sections = narrative ? (project.paperStudy || project.researchStudy).narrative.sections : [
      {key:"diagram",title:project.id === "project-agent" ? T("工作流", "Workflow") : project.id === "project-qwen" ? T("路线图", "Roadmap") : T("图解", "Visuals")},{key:"context",title:T("背景", "Context")},
      {key:"approach",title:["project-qwen","project-agent"].includes(project.id) ? T("细节", "Details") : T("方案", "Approach")},{key:"results",title:T("结果", "Results")}
    ];
    const returnLink = body.querySelector(".project-footer .text-link");
    if (returnLink) {
      returnLink.dataset.previewClose = "";
      returnLink.innerHTML = bi(T("关闭项目 · 恢复布局", "Close project · Restore layout"),true) + arrow;
    }
    runPreviewMotion(() => {
      preview.dataset.project = id;
      preview.dataset.view = view;
      preview.querySelector(".preview-tabs").innerHTML = sections.map(info => '<button type="button" data-preview-section="' +
        info.key + '">' + bi(info.nav || info.title,true) + '</button>').join('');
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
  function setPerspective(perspective, persist = true, navigate = true) {
    const view = perspective === "technology" ? "technology" : "experience";
    if (preview.open || previewMotion.pending) closeProjectPreview(true);
    document.body.dataset.perspective = view;
    document.getElementById("experience").hidden = view !== "experience";
    document.getElementById("technology").hidden = view !== "technology";
    document.querySelectorAll("button[data-perspective]").forEach(button =>
      button.setAttribute("aria-pressed",String(button.dataset.perspective === view)));
    sectionIds[0] = view;
    document.querySelectorAll('[data-section-slot="0"]').forEach(link => {
      link.href = "#" + view;
      link.dataset.sectionLink = view;
      link.innerHTML = (link.closest(".section-nav") ? '<span class="nav-line" aria-hidden="true"></span>' : '') +
        bi(view === "technology" ? ui.technologyNav : ui.nav[0],true);
    });
    preview.querySelector(".preview-mobile-label").innerHTML = bi(view === "technology" ? T("返回技术", "Back to technology") : T("返回经历", "Back to experience"),true);
    setLanguage(document.documentElement.lang === "en" ? "en" : "zh",false);
    if (persist) { try { localStorage.setItem("jason-portfolio-perspective",view); } catch (_) {} }
    if (navigate) {
      history.replaceState(history.state,"",location.pathname + location.search + "#" + view);
      document.getElementById(view).scrollIntoView({behavior:reducedMotion.matches ? "instant" : "smooth",block:"start"});
    }
    scheduleReadingUpdate();
  }
  function revealPerspectiveFor(target) {
    if (target.closest("#technology") && document.getElementById("technology").hidden) setPerspective("technology",true,false);
    if (target.closest("#experience") && document.getElementById("experience").hidden) setPerspective("experience",true,false);
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
    const perspectiveButton = event.target.closest("button[data-perspective]");
    if (perspectiveButton) {
      if (perspectiveButton.dataset.perspective !== document.body.dataset.perspective) setPerspective(perspectiveButton.dataset.perspective);
      return;
    }
    const forecastEnlarge = event.target.closest("[data-forecast-enlarge],[data-agent-enlarge]");
    if (forecastEnlarge) {
      const isAgent = forecastEnlarge.hasAttribute("data-agent-enlarge");
      const dialog = document.createElement("dialog");
      dialog.className = "forecast-dialog" + (isAgent ? " agent-workflow-dialog" : "");
      dialog.setAttribute("aria-labelledby","forecast-dialog-title");
      dialog.innerHTML = '<header><div><h2 id="forecast-dialog-title">' +
        bi(isAgent ? T("运营 Agent · 从规划到反馈闭环", "Operations Agent · From plans to a feedback loop") : T("LLM 增强价量预估 · 双线优化路径", "LLM-enhanced forecasting · Two optimization tracks")) +
        '</h2><p>' + bi(isAgent ? T("工具提供预测，Agent 组织规划，人工把关执行", "Tools forecast, the Agent plans, humans approve execution") : T("Qwen3 提供任务表征，DEFormer 完成价量预测", "Qwen3 supplies task features; DEFormer forecasts price–sales responses")) +
        '</p></div><button type="button" data-forecast-close autofocus>' + bi(T("关闭", "Close"),true) + '</button></header>';
      const roadmap = forecastEnlarge.closest(isAgent ? ".agent-workflow" : ".forecast-roadmap").cloneNode(true);
      roadmap.querySelector(".forecast-map-toolbar").remove();
      dialog.append(roadmap);
      document.body.append(dialog);
      dialog.addEventListener("close",() => {
        dialog.remove();
        if (preview.open) setPreviewLayout();
        forecastEnlarge.focus({preventScroll:true});
      },{once:true});
      dialog.showModal();
      return;
    }
    const forecastClose = event.target.closest("[data-forecast-close]");
    if (forecastClose) { forecastClose.closest("dialog").close(); return; }
    const projectTrigger = event.target.closest("[data-open-project]");
    if (projectTrigger && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) {
      event.preventDefault();
      projectTrigger.closest(".forecast-dialog")?.close();
      openProjectPreview(projectTrigger.dataset.openProject, projectTrigger);
      return;
    }
    const previewClose = event.target.closest("[data-preview-close]");
    if (previewClose) { event.preventDefault(); closeProjectPreview(); return; }
    const previewProject = event.target.closest("[data-preview-project]");
    if (previewProject) { openProjectPreview(previewProject.dataset.previewProject,undefined,previewProject.dataset.previewView); return; }
    const agentStep = event.target.closest("[data-agent-step]");
    if (agentStep) {
      const workflow = agentStep.closest(".agent-workflow");
      workflow.querySelectorAll("[data-agent-step]").forEach(button =>
        button.setAttribute("aria-pressed",String(button === agentStep)));
      workflow.querySelectorAll("[data-agent-panel]").forEach(panel =>
        panel.hidden = panel.dataset.agentPanel !== agentStep.dataset.agentStep);
      scheduleReadingUpdate();
      return;
    }
    const forecastStep = event.target.closest("[data-forecast-step]");
    if (forecastStep) {
      const roadmap = forecastStep.closest(".forecast-roadmap");
      roadmap.querySelectorAll("[data-forecast-step]").forEach(button =>
        button.setAttribute("aria-pressed",String(button === forecastStep)));
      roadmap.querySelectorAll("[data-forecast-panel]").forEach(panel =>
        panel.hidden = panel.dataset.forecastPanel !== forecastStep.dataset.forecastStep);
      scheduleReadingUpdate();
      return;
    }
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
    const link = event.target.closest('a[data-language-hash]');
    if (link) {
      const target = document.getElementById(link.dataset.languageHash.slice(1));
      if (target) {
        revealPerspectiveFor(target);
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
    // The enlarged roadmap owns its native Escape handling and focus trap.
    if (document.querySelector(".forecast-dialog[open]")) return;
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
    revealPerspectiveFor(target);
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
  window.addEventListener("popstate", event => {
    setLanguage(window.portfolioLanguage.fromPath() || event.state?.portfolioLanguage || "zh", false);
  });
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
  let savedPerspective = "experience";
  try { savedPerspective = localStorage.getItem("jason-portfolio-perspective") || savedPerspective; } catch (_) {}
  setPerspective(savedPerspective,false,false);
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
