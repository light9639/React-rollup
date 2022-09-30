# :zap: Rollup으로 React 개발환경 구축하기
:octocat: 바로가기 : https://light9639.github.io/React-rollup/
![localhost_8080_](https://user-images.githubusercontent.com/95972251/191442624-70ca8d5a-dafb-44b4-9ee2-66446ef00ed6.png)
**✨React Rollup 템플릿✨**
## 📋 템플렛 생성법
### 📦 package.json 생성
- 일단 적당한 폴더를 만들고 아래 명령어로 package.json 파일을 생성한다.

    ```bash
    yarn init -y
    ```

### 🚝 React 설치
 - React 설치

    ```bash
    yarn add react react-dom
    ```

### 🚅 Babel 설치
 - Webpack과 비슷하다. preset-env를 추가하면 오류가 나는 관계로 빼서 작성함.

    ```bash
    ## @babel/preset-react - 리액트의 JSX 문법을 변환
    yarn add @babel/core @babel/preset-react 
    ```

### 📦 babel.config.json 생성
 - babel.config.json 생성

    ```bash
    {
      "presets": [
        ["@babel/preset-react", { "runtime": "automatic" }]
      ]
    }
    ```

React 17 이후 버젼부터는 "runtime": "automatic" 옵션을 추가해야 한다.

### ✅ Rollup 설치
 - Rollup 설치

    ```bash
    yarn add rollup
    ```

### 🔌 Rollup 플러그인 설치
 - Rollup 플러그인 설치

    ```bash
    yarn add @rollup/plugin-babel @rollup/plugin-commonjs @rollup/plugin-node-resolve @rollup/plugin-replace rollup-plugin-styles rollup-plugin-smart-asset rollup-plugin-copy rollup-plugin-generate-html-template rollup-plugin-delete rollup-plugin-serve rollup-plugin-livereload
    ```

    ```bash
    ├── @rollup/plugin-babel - 바벨과 연동
    ├── @rollup/plugin-commonjs - CommonJS 모듈 지원
    ├── @rollup/plugin-node-resolve - 외부 모듈(node_modules)도 포함
    ├── @rollup/plugin-replace - 특정 문자열을 치환. process.env.NODE_ENV를 처리하기 위해서 사용
    ├── rollup-plugin-styles - css 파일을 해석하고 삽입
    ├── rollup-plugin-smart-asset - 이미지 파일 등을 해석하고 삽입
    ├── rollup-plugin-copy - 파일을 복사. public 내용을 복사하기 위해 사용
    ├── rollup-plugin-generate-html-template - 번들이 삽입된 html 파일을 생성
    ├── rollup-plugin-delete - 빌드 전 빌드 폴더 안 내용을 정리하고 빌드
    ├── rollup-plugin-serve - 개발 서버 실행. 아쉽게도 핫 리로드는 안됨...
    └── rollup-plugin-livereload - 변경사항이 있으면 새로고침. 위 플러그인이 리로드 기능이 없어서 이를 보완하기 위해 설치
    ```

### 🎊 rollup.config.js 생성
- 최대한 웹팩과 비슷하게 구성하려고 노력했다.

    ```bash
    import del from 'rollup-plugin-delete';
    import { nodeResolve } from '@rollup/plugin-node-resolve';
    import replace from '@rollup/plugin-replace';
    import { babel } from '@rollup/plugin-babel';
    import commonjs from '@rollup/plugin-commonjs';
    import styles from 'rollup-plugin-styles';
    import smartAsset from 'rollup-plugin-smart-asset';
    import copy from 'rollup-plugin-copy';
    import htmlTemplate from 'rollup-plugin-generate-html-template';
    import serve from 'rollup-plugin-serve';
    import livereload from 'rollup-plugin-livereload';

    const devMode = process.env.NODE_ENV !== 'production';

    export default {
      input: 'src/index.js',
      output: {
        file: 'build/index.js',
        format: 'iife',
        assetFileNames: '[name].[hash][extname]',
        inlineDynamicImports: true,
      },
      plugins: [
        del({
          targets: 'build/*',
          runOnce: true,
        }),
        nodeResolve(),
        replace({
          'process.env.NODE_ENV': JSON.stringify('production'),
        }),
        babel({
          babelHelpers: 'bundled',
        }),
        commonjs(),
        styles({
          mode: 'extract',
        }),
        smartAsset({
          url: 'copy',
          nameFormat: '[name].[hash][ext]',
        }),
        copy({
          targets: [{ src: ['public/**/*', '!public/index.html'], dest: 'build' }],
        }),
        htmlTemplate({
          template: 'public/index.html',
          target: 'index.html',
          replaceVars: { '%PUBLIC_URL%': '.' },
        }),
      ].concat(
        devMode
          ? [
              serve({
                contentBase: 'build',
                open: true,
                port: 3000,
                historyApiFallback: true,
              }),
              livereload({
                watch: 'build',
              }),
            ]
          : []
      ),
    };
    ```

- 개발 서버 실행 시 자꾸 꺼지는 현상이 있다면 livereload 플러그인과 copy 플러그인 때문이니, public/index.html 파일 제외로 해결하면 된다.

### ✒️ 리액트 컴포넌트 작성
- 그냥 CRA에서 기본으로 만들어주는 예제 파일을 그대로 복사한다. (src, public 폴더) 단, 예제 소스에서는 web-vitals을 사용하므로 이걸 추가로 설치해야 한다.

    ```bash
    yarn add web-vitals
    ```

### :tada: package.json에 scripts 추가
 - package.json에 scripts 추가

    ```bash
    "scripts": {
      "start": "rollup -c -w --environment NODE_ENV:development",
      "build": "rollup -c --environment NODE_ENV:production"
    }
    ```

- yarn start - 개발 서버를 실행해 프로젝트를 바로 확인. 주소는 http://localhost:3000/ <br>
- yarn build - 빌드. 결과물은 build 폴더에 생성

## **:paperclip: 출처**
- 출처1 : <a href="https://blog.itcode.dev/projects/2022/06/10/react-components-library-starter">링크1</a>
- 출처2 : <a href="https://blog.joyfui.com/1251">링크2</a>
