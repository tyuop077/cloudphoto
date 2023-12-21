# CloudPhoto

### Подготовка зависимостей

1. Установить `nodejs`.

**Ubuntu** `sudo snap install node --classic --channel=18` \
**Debian** `sudo apt install nodejs` \
**Windows** `winget install -e --id OpenJS.NodeJS`

Проверьте, что версия `>18` через `node --version`.

2. Установить зависимости проекта.

> Изначально проект разрабатывался с использованием пакетного менеджера `yarn`, но можно и быстро через `npm` (не рекомендуется)
> <details>
>   <summary>Вариант через `yarn` если необходимо</summary>
> 
> **Linux и Windows** `npm i -g yarn && yarn set version stable && yarn install`
> 
> Ubuntu APT не имеет последнюю версию `yarn`, поэтому в данном случае самым простым способом будет установить старую версию с `npm` и обновить её до последней через `yarn`.
> </details>

**NPM** `npm i` \
**Yarn** `yarn`

Если установка `node` была через `snap`, то `yarn` уже должен быть установлен.

3. Скомпилировать проект

**NPM** `npm run build` \
**Yarn** `yarn build`

4. Запустить проект

**NPM** `npm start` \
**Yarn** `yarn start` \
**Напрямую, без пакетного менеджера** `node ./dist/main`

5. (необязательно) Добавить alias для запуска CLI из любой папки

**NPM** `alias cloudphoto='npm start --prefix /путь_к_проекту'` \
**Yarn** `alias cloudphoto='yarn start --prefix /путь_к_проекту'` \
**Без пакетного менеджера** `alias cloudphoto='/путь_к_проекту/dist/main'`

Также можно добавить данную строку в `.bashrc` для автоматического добавления при запуске системы.

### Запуск проекта

**Без alias, NPM** `npm start <аргументы>` \
**Без alias, Yarn** `yarn start <аргументы>` \
**Alias** `cloudphoto <аргументы>`
