---
note_type: ao3-export-guide
title: Pipeline de Exportación a Archive of Our Own (AO3)
uid: SYS-AO3-EXPORT-PROCEDURE
status: established
aliases:
  - Exportación AO3
  - AO3 Export Guide
  - SYS-AO3-EXPORT-PROCEDURE
tags:
  - '#system/export'
created: '2026-11-01'
updated: '2026-11-02'
---

# 🚀 Pipeline de Exportación a Archive of Our Own (AO3)

> Procedimiento técnico para compilar y transferir capítulos en español a AO3 sin rotura de formato.

## Pasos de Publicación
1. **Limpieza de Formato:** Asegurar eliminación de encabezados YAML frontmatter y comentarios `%%...%%`.
2. **Conversión de Wikilinks:** Reemplazar enlaces internos `[[Nota|Alias]]` por el texto plano del alias en español.
3. **Generação de HTML:** Exportar a HTML limpio (conservando `<em>`, `<strong>` y separadores `<hr />`).
4. **Carga en AO3:** Pegar directamente en la pestaña **HTML** del editor de AO3.

