---
note_type: ao3-export-guide
aliases: ["Exportación AO3", "AO3 Export Guide"]
---

# 🚀 Pipeline de Exportación a Archive of Our Own (AO3)

> Procedimiento técnico para compilar y transferir capítulos en español a AO3 sin rotura de formato.

## Pasos de Publicación
1. **Limpieza de Formato:** Asegurar eliminación de encabezados YAML frontmatter y comentarios `%%...%%`.
2. **Conversión de Wikilinks:** Reemplazar enlaces internos `[[Nota|Alias]]` por el texto plano del alias en español.
3. **Generación de HTML:** Exportar a HTML limpio (conservando `<em>`, `<strong>` y separadores `<hr />`).
4. **Carga en AO3:** Pegar directamente en la pestaña **HTML** del editor de AO3.

