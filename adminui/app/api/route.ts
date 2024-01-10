export const dynamic = "force-dynamic"; // defaults to auto
export async function GET(request: Request) {
  console.log("app/api/route.ts GET");
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  console.log(id);
  console.log(process.env.HELLO);
  const product = {
    id: "1",
    name: "Product 1",
    price: 100,
    description: "This is product 1",
    hello: process.env.HELLO,
  };

  return Response.json({ product });
}
