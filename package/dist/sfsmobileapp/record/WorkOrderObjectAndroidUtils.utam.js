export async function scroll({ pageObject }) {
    await pageObject.getRoot().flick(0, -600);
}