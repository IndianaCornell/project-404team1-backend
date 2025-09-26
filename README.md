# project-404team1-backend

## API Documentation (Swagger)

У проєкті використовується **Swagger UI** для інтерактивного тестування API.  
Всі ендпоінти описані у файлі [`docs/openapi.yaml`](docs/openapi.yaml).  
При кожній збірці він компілюється у `docs/swagger.json`.

### Запуск документації

- **Запустити сервер у режимі розробки (без Swagger-збірки):**

  npm run dev

Згенерувати нову документацію та запустити сервер:

npm run docs:dev

Тільки згенерувати swagger.json із openapi.yaml:

npm run build-docs

Превʼю документації з hot-reload (без бекенду):

npm run preview-docs

Відкрити Swagger UI
Після запуску сервера документація доступна тут:
👉 http://localhost:3000/api-docs

⚠️ docs/swagger.json генерується автоматично з docs/openapi.yaml.
Не редагуйте цей файл вручну!

Повна інструкція з прикладами використання доступна тут: ➡️ docs\SWAGGER_GUIDE.md
