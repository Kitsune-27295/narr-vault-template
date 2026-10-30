---
uid: "TMP-Chapter_pt-BR"
type: chapter
title: "Capítulo <NN>: <Título do Capítulo>"
chapter_number: 1
volume_number: 1
language: pt-BR
status: draft
pov: "<CHR-Nome_do_Personagem_POV>"
timeline_event: "<EVT-Nome_do_Evento>"
arc: "<ARC-Nome_do_Arco>"
word_count: 0
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags:
  - "manuscript/pt-BR"
  - "manuscript/draft"
---
# Capítulo <NN>: <Título do Capítulo>

Derechos de autor reservados a los autores respectivos.

"Diálogo": Representado entre aspas duplas para conversas verbais diretas entre personagens.

'Pensamentos': Representado entre aspas simples para reflexões internas e monólogos psicológicos.

-------------------------------

<!-- p:1 -->
<Parágrafo 1: Ancoragem sensorial inicial, estabelecimento da atmosfera, perspectiva focal do POV, iluminação e contexto espacial imediato.>

<!-- p:2 -->
<Parágrafo 2: Movimento inicial e desenvolvimento da cena; ritmo contínuo, eliminação de construções passivas e grounded storytelling.>

<!-- p:3 -->
"Exemplo de diálogo direto respeitando a voz do personagem e seu registro de formalidade", disse ele calmamente, avaliando o oponente.

<!-- p:4 -->
'Exemplo de reflexão interna e cálculo tático delimitado por aspas simples', ponderou ele em silêncio enquanto circulava a energia interna.

<!-- p:5 -->
<Parágrafo 5: Desdobramento da ação, manifestação de alma marcial, cinética de combate ou virada dramática, respeitando os custos de energia e limites de Sanderson.>

<!-- p:6 -->
<Parágrafo 6: Conclusão do capítulo, ancoragem das consequências imediatas e gancho narrativo (cliffhanger ou resolução parcial) para o próximo capítulo.>

---

## Checklist de Continuidade Pós-Capítulo (Uso do Autor / Agente)
- [ ] **Auditoria de Delimitadores:** Todos os parágrafos estão prefixados sequencialmente por `<!-- p:N -->` sem saltos numéricos?
- [ ] **Regra CJK (VAL010):** Proibido qualquer ideograma CJK no texto em prosa (usar Pinyin ou nomenclatura ocidental de `TRM-Termbase.md`).
- [ ] **Horizonte Epistêmico (LDG-Character_Knowledge):** O personagem POV agiu exclusivamente com o conhecimento disponível na cena?
- [ ] **Chekhov Weapons (LDG-Chekhov_Guns):** Algum item, arma ou promessa foi introduzido (`status: primed`) ou acionado (`status: discharged`)?
- [ ] **Custos de Sanderson:** Os gastos de poder de alma, fadiga física e recuo articular foram devidamente cobrados na narrativa?
- [ ] **Verificação de Linter:** O comando `narr prompt validate write-chapter <caminho_do_arquivo>` encerrou com código 0?
