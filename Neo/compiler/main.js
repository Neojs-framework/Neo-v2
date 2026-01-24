import { NeoParser } from './NeoParser.js';
import { NeoCore } from '../core/NeoCore.js';

// 현재 보고 있는 페이지 상태
let currentPath = 'App.neo'; 

async function render() {
    const app = document.getElementById('app');
    
    try {
        // 1. 파일 읽기 (최소한의 노력)
        const response = await fetch(`../src/${currentPath}`);
        const rawCode = await response.text();

        // 2. 분석 시키기 (Parser)
        const parsedData = NeoParser.parse(rawCode);

        // 3. 생성 시키기 (Core)

        // 1️⃣ Script → Context 생성
        const ctx = NeoCore.createScriptContext(parsedData.script);

        // 2️⃣ UI 생성 시 ctx 전달
        const ui = NeoCore.create(parsedData, ctx);

        // 4. 화면 갈아끼우기 (최대의 결과)
        app.innerHTML = ''; 
        app.appendChild(ui);
        
        console.log(`🚀 ${currentPath} 렌더링 완료!`);
    } catch (err) {
        console.error("렌더링 중 에러 발생:", err);
    }
}

// 전역 네비게이션 함수 (어디서든 호출 가능)
window.neoNavigate = (path) => {
    currentPath = path;
    render();
};

render();