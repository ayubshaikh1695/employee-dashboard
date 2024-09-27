import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { employeeId, status, additionalDetails } = await req.json();

  console.log(`Received callback for Employee ID: ${employeeId}, Status: ${status}, Details: ${additionalDetails}`);

  return NextResponse.json({ message: 'Callback received and processed' });
}
