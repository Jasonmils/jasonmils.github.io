---
permalink: /Ongoing/
title: "On-going Business"
author_profile: true
redirect_from: 
  - /md/
---
<!-- This page records what I am currently occupied with, including something I am doing, and something I want to do. I find it a very motivating process via committing to this website. -->

> This page is currently under maintainance, will be back soon with [mermaid](http://mermaid.js.org/config/usage.html).

<!-- ```mermaid
gantt

       dateFormat                YYYY-MM-DD
       title                     Adding GANTT diagram functionality to mermaid
       excludes                  :excludes the named dates/days from being included in a charted task.. 
       (Accepts specific dates in YYYY-MM-DD format, days of the week ("sunday") or "weekends", but not the word "weekdays".) 
       section A section
       Completed task            :done,    des1, 2020-01-06,2020-01-08
       Active task               :active,  des2, 2020-01-09, 3d
       Future task               :         des3, after des2, 5d
       Future task2              :         des4, after des3, 5d

       section Critical tasks
       Completed task in the critical line :crit, done, 2020-01-06,24h
       Implement parser and jison          :crit, done, after des1, 2d
       Create tests for parser             :crit, active, 3d
       Future task in critical line        :crit, 5d
       Create tests for renderer           :2d
       Add to mermaid                      :1d

       section Documentation
       Describe gantt syntax               :active, a1, after des1, 3d
       Add gantt diagram to demo page      :after a1  , 20h
       Add another diagram to demo page    :doc1, after a1  , 48h

       section Last section
       Describe gantt syntax               :after doc1, 3d
       Add gantt diagram to demo page      :20h
       Add another diagram to demo page    :48h
``` -->
<!-- <script type="module">
  import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
  mermaid.initialize({ startOnLoad: true });
</script> -->

<head>
  <script src="https://unpkg.com/mermaid@8.2.4/dist/mermaid.min.js"></script>
</head>

<div id="gantt">
gantt
  title A Gantt Diagram
  dateFormat  YYYY-MM-DD
  section Section
  Completed :done,    des1, 2014-01-01, 2014-01-05
  Active :active, des2, 2014-01-06, 2014-01-08
  Section 2
  Approved : valid, des3, 2014-01-09, 2014-01-12
  Review : active, des4, 2014-01-13, 2014-01-16
  section Future
  Planning : future, des5, 2014-01-17, 2014-01-20
  Execution : future, des6, 2014-01-21, 2014-02-01
</div>

mermaid.initialize({startOnLoad:true});