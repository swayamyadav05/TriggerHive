import { NextRequest, NextResponse } from "next/server";

// Mock customer database
const mockCustomers: Record<
  string,
  {
    id: string;
    name: string;
    email: string;
    company: string;
    tier: string;
    joinDate: string;
  }
> = {
  cus_test_123: {
    id: "cus_test_123",
    name: "John Smith",
    email: "john.smith@techcorp.com",
    company: "TechCorp Inc.",
    tier: "Enterprise",
    joinDate: "2024-01-15",
  },
  cus_test_456: {
    id: "cus_test_456",
    name: "Sarah Johnson",
    email: "sarah.j@startupco.io",
    company: "StartupCo",
    tier: "Pro",
    joinDate: "2024-06-20",
  },
  default: {
    id: "cus_default",
    name: "Alex Developer",
    email: "alex@example.com",
    company: "Demo Company",
    tier: "Starter",
    joinDate: "2024-12-10",
  },
};

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const customerId = url.searchParams.get("id") || "default";

    // Simulate API delay for realism
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Get customer or return default
    const customer =
      mockCustomers[customerId] || mockCustomers["default"];

    return NextResponse.json({
      success: true,
      data: customer,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch customer data",
      },
      { status: 500 }
    );
  }
}
