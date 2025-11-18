import "dotenv/config";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnablePassthrough, RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { ChatOpenAI } from "@langchain/openai";

const productFacts = `
- 型号 ES-Home 5/10/15 kWh，模组化设计，可并联至 30 kWh。
- 支持 6 kW 逆变器，光伏直连，内置 UPS 切换（<10 ms）。
- 工作温度 -10℃~50℃，建议 10℃~35℃；海拔 ≤2000 m；IP54 防护。
- Wi-Fi / 以太网 / RS485 接口，APP 可查看 SOC、功率、告警日志。
`;

const safetyNotes = `
- 请勿在有水汽或易燃区域拆机；充放电时保持通风，避免阳光直射。
- 告警代码 E12/E31 为高温保护，需先断开充放电，等待温度回落后再上电。
- 长时间停用请保持 40%~60% SOC，并每 3 个月补电一次。
`;

const troubleshooting = `
- 无法联网：确认路由器 2.4G 开启，距离 <10 m；如有 E08 代码，长按配网键 5 秒重新配对。
- 续航不足：在 APP 中查看“今日充电量”和“峰谷时段设置”；夜间若无补电任务，设备会优先光伏自充。
- 无法逆变带载：检查旁路开关是否合闸；E21/E22 提示为输出过载，需减少同时启动的大功率电器。
`;

const warranty = `
- 整机质保 5 年或 6000 次循环，以先到者为准。
- 人为拆机、擅自更换电芯或使用非原厂逆变器会导致保修失效。
- 需要上门服务时，请提供安装日期、序列号、告警截图和联系方式。
`;

const behaviorGuide = `
- 始终用简洁、安心的中文客服语气回答。
- 优先使用提供的上下文，缺少信息时明确告知并给出下一步建议。
- 对与设备无关的问题礼貌拒答，建议咨询其他渠道。
`;

const prompt = ChatPromptTemplate.fromMessages([
  [
    "system",
    [
      "你是家用储能设备的金牌客服，需根据提供的产品资料答复用户。",
      "产品资料：{productFacts}",
      "安全注意：{safetyNotes}",
      "常见排障：{troubleshooting}",
      "保修政策：{warranty}",
      "客服行为：{behaviorGuide}"
    ].join("\n")
  ],
  [
    "human",
    [
      "用户问题：{input}",
      "回答要求：",
      "1) 先用一句话概括建议；",
      "2) 如需操作，列成有序步骤；",
      "3) 如涉及风险，请给安全提醒；",
      "4) 输出使用中文。"
    ].join("\n")
  ]
]);

const model = new ChatOpenAI({
  modelName: "gpt-4o-mini",
  temperature: 0.3
});

const chain = RunnableSequence.from([
  {
    input: new RunnablePassthrough(),
    productFacts: () => productFacts,
    safetyNotes: () => safetyNotes,
    troubleshooting: () => troubleshooting,
    warranty: () => warranty,
    behaviorGuide: () => behaviorGuide
  },
  prompt,
  model,
  new StringOutputParser()
]);

const question = process.argv.slice(2).join(" ") || "请简单介绍 ES-Home 的保养注意事项";

const result = await chain.invoke(question);
console.log("\n===== 客服回复 =====\n");
console.log(result);
