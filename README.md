## VK Mini Apps Фронт бота для голосования

```bash
$ npm install # or pnpm install or yarn install
```

## Доступные скирипты

в дириктории проекта вы можете:

### `yarn dev`, `yarn start`, `yarn tunnel`, `yarn codegen` или `yarn codegen:wath`

Для просмотра в dev режиме открыть [http://localhost:3000](http://localhost:3000) to view it in the browser.
Должна стоять в .env `VITE_DEBUG_VK_QUERY` которую можно взять при запуске прижожения из ВК в теге iframe

### Создание тунеля для дебага в vk

Нужно запустить приложение через `yarn dev`, запустить `yarn tunnel` и после вставить ссылку из cli в настройки приложения vk

### Обновление клиента GQL и создание запросов

для обновления нужно запустить `yarn codegen` для создания запросов и генерации типов к ним запустить `yarn codegen:wath`
*ВАЖНО* для генерации необходимо запустить в фоне бота

