import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { success, message, employeeId } = await req.json();

  console.log(`Received callback for Employee ID: ${employeeId}, Success: ${success}, Message: ${message}`);

  return NextResponse.json({ message: 'Callback received and processed' });
}
