import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { repoUrl } = body;

    // Create a simulated fork event payload
    const simulatedPayload = {
      action: "created",
      repository: {
        full_name: repoUrl
      },
      sender: {
        login: "test-user",
        html_url: "https://github.com/test-user"
      },
      forkee: {
        full_name: "test-user/forked-repo",
        html_url: "https://github.com/test-user/forked-repo",
        created_at: new Date().toISOString()
      }
    };

    // Forward the simulated payload to our webhook endpoint
    // Normalize the webhook URL
    let webhookUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    if (!webhookUrl.startsWith('http')) {
      webhookUrl = `https://${webhookUrl}`;
    }
    // Remove trailing slash if present
    webhookUrl = webhookUrl.replace(/\/$/, '');

    const webhookResponse = await fetch(`${webhookUrl}/api/webhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(simulatedPayload)
    });

    const result = await webhookResponse.json();
    
    return NextResponse.json({
      status: 'success',
      message: 'Fork event simulated',
      webhookResponse: result
    });
  } catch (error) {
    console.error('Error simulating fork:', error);
    return NextResponse.json({ error: 'Failed to simulate fork' }, { status: 500 });
  }
}
