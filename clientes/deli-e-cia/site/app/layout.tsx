import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
 title: "Deli & Cia | Padaria, café e delicatessen em Salvador",
 description: "Pães de fermentação natural, café e uma seleção de empório. Conheça a Deli & Cia, encontre uma unidade em Salvador e fale com o DeliDelivery.",
 openGraph: { title: "Deli & Cia · A mesa está posta", description: "O seu dia. Em boa companhia.", locale: "pt_BR", type: "website", images: [{url:"/images/og.webp",width:1200,height:630}] },
 icons:{icon:"/favicon.svg"}, robots:{index:false,follow:false}
};
export default function RootLayout({children}:{children:React.ReactNode}) {
 return <html lang="pt-BR"><body>{children}</body></html>;
}