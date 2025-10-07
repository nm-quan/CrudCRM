import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const accessToken = process.env.GMAIL_ACCESS_TOKEN;
    
    if (!accessToken) {
      return NextResponse.json(
        { error: 'GMAIL_ACCESS_TOKEN not found in environment variables. Please add it to .env.local' },
        { status: 500 }
      );
    }

    // 1️⃣ Fetch list of messages
    const listResponse = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=500',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        cache: 'no-store',
      }
    );

    if (!listResponse.ok) {
      const errorText = await listResponse.text();
      console.error('Gmail API Error Status:', listResponse.status);
      console.error('Gmail API Error Response:', errorText);
      
      let errorMessage = 'Unknown error';
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error?.message || errorData.error || 'Unknown error';
      } catch {
        errorMessage = `HTTP ${listResponse.status}: ${errorText.substring(0, 200)}`;
      }
      
      return NextResponse.json(
        { error: `Gmail API error: ${errorMessage}` },
        { status: listResponse.status }
      );
    }

    const listData = await listResponse.json();
    const messages = listData.messages || [];

    if (messages.length === 0) {
      return NextResponse.json([]);
    }

    // 2️⃣ Fetch details for each message
    const emailPromises = messages.map(async (message: { id: string }) => {
      const detailResponse = await fetch(
        `https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}?format=full`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          cache: 'no-store',
        }
      );

      if (!detailResponse.ok) {
        console.error(`Failed to fetch message ${message.id}`);
        return null;
      }

      return detailResponse.json();
    });

    const emailDetails = await Promise.all(emailPromises);
    const validEmails = emailDetails.filter(email => email !== null);

    // 3️⃣ Parse and filter subscription-related emails
    const subscriptionEmails = validEmails
      .map((email: any) => {
        const headers = email.payload.headers;
        const subject = headers.find((h: any) => h.name === 'Subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name === 'From')?.value || 'Unknown';
        const dateStr = headers.find((h: any) => h.name === 'Date')?.value || '';
        const snippet = email.snippet?.toLowerCase() || '';

        let formattedDate = '';
        try {
          formattedDate = new Date(dateStr).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        } catch {
          formattedDate = dateStr;
        }

        // 4️⃣ Check for subscription-related keywords
        const isSubscription =
          snippet.includes('unsubscribe') ||
          snippet.includes('subscription') ||
          snippet.includes('newsletter') ||
          subject.toLowerCase().includes('unsubscribe') ||
          subject.toLowerCase().includes('subscription') ||
          subject.toLowerCase().includes('newsletter');

        if (isSubscription) {
          return {
            id: email.id,
            subject,
            from,
            snippet: email.snippet || '',
            date: formattedDate,
          };
        }
        return null;
      })
      .filter((email) => email !== null);

    // 5️⃣ Return only subscription emails
    return NextResponse.json(subscriptionEmails);
  } catch (error) {
    console.error('Gmail API Error:', error);
    return NextResponse.json(
      { error: `Failed to fetch emails: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
