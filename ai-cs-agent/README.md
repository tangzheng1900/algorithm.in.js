# 家用储能设备客服 Agent（LangChain + OpenAI）

该示例展示了如何使用 LangChain 调用 LLM 构建面向家用储能设备的客服 Agent。

## 快速开始
1. 安装依赖：
   ```bash
   npm install
   ```
2. 配置 OpenAI API Key（或兼容接口）：
   ```bash
   export OPENAI_API_KEY="YOUR_KEY"
   ```
3. 运行交互：
   ```bash
   npm start -- "如何让电池重新上线？"
   ```

## 说明
- `index.js` 中定义了系统提示，包含设备规格、安全注意、保修政策等上下文。
- 通过 LangChain 的 `RunnableSequence` 组合模板、模型和输出解析，确保回答遵循客服语气并返回中文结果。
- `npm run demo` 提供了一个示例问题，便于快速体验。
