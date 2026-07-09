{% set content_dir = page.relative_path | trim_end_matches(pat="index.md") -%}
{% set source_path = "@/" ~ content_dir ~ path -%}
{% set source = load_data(path=source_path, format="plain") -%}
```{{ language }}
{{ source | safe }}
```
