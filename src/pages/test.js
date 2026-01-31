export async function get() {
    return new Response(JSON.stringify({message:"Hello"}), {
        status:200,
        headers: {"content-type" : "application/json"},
    });
}