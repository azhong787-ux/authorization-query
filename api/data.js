// Vercel Serverless Function - 飞书API代理
export default async function handler(req, res) {
    // 允许跨域
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const FEISHU_CONFIG = {
        appId: 'cli_a92be96b8924dcb1',
        appSecret: 'hzimq5TAra8sTKSX6QFsHd1JKMQKgEHa',
        appToken: 'O0kZbZifFa0MN3syVRKcjagJn2e',
        tableId: 'tbl7M0z6XZbfKZ0Y'
    };

    try {
        // 1. 获取token
        const tokenRes = await fetch('https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                app_id: FEISHU_CONFIG.appId,
                app_secret: FEISHU_CONFIG.appSecret
            })
        });
        const tokenData = await tokenRes.json();

        if (tokenData.code !== 0) {
            return res.status(500).json({ error: '获取token失败', details: tokenData });
        }

        const token = tokenData.tenant_access_token;

        // 2. 获取多维表格数据
        const dataRes = await fetch(
            `https://open.feishu.cn/open-apis/bitable/v1/apps/${FEISHU_CONFIG.appToken}/tables/${FEISHU_CONFIG.tableId}/records?pageSize=500`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        const data = await dataRes.json();

        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
