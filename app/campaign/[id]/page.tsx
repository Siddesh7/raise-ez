import {ethers} from "ethers";
import {getCampaign} from "../../lib/ethersFunction";
import {Metadata} from "next";

type Props = {
  params: {id: string};
};
export async function generateMetadata({params}: Props): Promise<Metadata> {
  const id = params.id;

  const res = await getCampaign(id);
  console.log(res);
  let imageURL = "";
  if (res) {
    let goal = res.goal.toString();
    let p;
    let fundsRaised = res.fundsRaised?.toString();
    console.log(fundsRaised);
    console.log(goal);

    p = (Number(fundsRaised) / Number(goal)) * 100;
    console.log(p);
    imageURL = `${process.env.NEXT_PUBLIC_HOST}/api/images/?n=${res.name}&d=${res.description}&p=${p}`;
  }

  const postUrl = `${process.env.NEXT_PUBLIC_HOST}/api/donate/?id=${id}`;

  return {
    title: res.name,
    description: res.description,
    openGraph: {
      title: "RaiseEZ",
      images: [imageURL],
    },
    other: {
      "fc:frame": "vNext",
      "fc:frame:image": imageURL,
      "fc:frame:post_url": postUrl,
      "fc:frame:input:text": "1 Matic",
      "fc:frame:button:1": "Donate",
    },
  };
}

export default function Home() {
  return (
    <main className="flex flex-col text-center lg:p-16">
      <h1>Hello</h1>
    </main>
  );
}
