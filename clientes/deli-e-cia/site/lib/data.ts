export const brand = {
 name: "Deli & Cia Delicatessen", instagram: "https://www.instagram.com/delieciadelicatessen_/",
 whatsapp: "5571992804369", checked: "2026-09-08",
 source: "https://linktr.ee/delieciadelicatessen"
};
export const orderUrl = (unit?: string) => "https://wa.me/" + brand.whatsapp + "?text=" + encodeURIComponent(unit ? "Olá! Gostaria de consultar as opções de pedido para a unidade " + unit + "." : "Olá! Gostaria de fazer um pedido na Deli & Cia.");
export const locations = [
 {id:"graca",name:"Graça",area:"Graça",floor:"Loja de rua",address:"Av. Euclydes da Cunha, 79 · Graça",city:"Salvador, Bahia",lat:-12.9978816,lng:-38.5193431,hours:null as string | null,services:["Padaria","Delicatessen","Empório"],source:"https://www.google.com.br/maps/place/Deli+%26+Cia/@-12.9978816,-38.521918,17z/",directions:"https://www.google.com/maps/dir/?api=1&destination=-12.9978816,-38.5193431",sourceLabel:"Endereço conferido no Google Maps"},
 {id:"barra",name:"Shopping Barra",area:"Barra",floor:"L1 Oeste",address:"Av. Centenário, 2992 · Chame-Chame",city:"Salvador, Bahia",lat:-13.0096,lng:-38.5249,hours:null as string | null,services:["Padaria","Delicatessen","Minimercado"],source:"https://shoppingbarra.com/loja/deli-e-cia-delicatessen/", directions:"https://www.google.com/maps/dir/?api=1&destination=Shopping+Barra+Salvador",sourceLabel:"Endereço conforme o site do shopping"},
 {id:"salvador",name:"Salvador Shopping",area:"Caminho das Árvores",floor:"Piso L3 · Praça de alimentação",address:"Av. Tancredo Neves, 3133",city:"Salvador, Bahia",lat:-12.9770,lng:-38.4565,hours:"Segunda a sábado, 9h às 22h · Domingo, 12h às 21h",services:["Pães de fermentação natural","Seleção de importados"],source:"https://www.salvadorshopping.com.br/loja/deli-cia-quiosque-em-breve",directions:"https://www.google.com/maps/dir/?api=1&destination=Salvador+Shopping",sourceLabel:"Endereço conforme o site do shopping"}
] as const;
// Shopping coordinates identify the centres, not the individual shops.
// Graça: endereço e ponto do mapa confirmados; horários ainda não.
// Lauro de Freitas awaits primary-source confirmation. Do not publish as active.
export const pendingBusinessData = {
 locations:["Lauro de Freitas: existência de unidade ativa"],
 storePhotos:["Graça","Shopping Barra"], hours:["Graça","Shopping Barra"],
 menu:"Cardápio regular atualizado e especialidades por unidade",
 packaging:"Modelo 3D conceitual; substituir pelo modelo real da embalagem",
 domain:null
};
export const categories = [
 {id:"padaria",index:"01",name:"Padaria",note:"Fermentação natural",href:"#padaria",link:"Ver a padaria",text:"Pães de fermentação natural na seleção do dia, feitos com tempo."},
 {id:"cafe",index:"02",name:"Café",note:"Para sentar e ficar",href:"#cafe",link:"Ver a Deli ao longo do dia",text:"Um lugar para sentar, tomar um café e deixar a pressa do lado de fora."},
 {id:"emporio",index:"03",name:"Empório",note:"Importados e seleção",href:"#pedir",link:"Consultar pelo WhatsApp",text:"Uma seleção de importados e produtos para levar a boa mesa para casa."},
 {id:"delivery",index:"04",name:"DeliDelivery",note:"Pedido pelo WhatsApp",href:"#pedir",link:"Fazer um pedido",text:"A Deli vai até você. Cardápio, disponibilidade e entrega pelo WhatsApp."}
] as const;
export const dayParts = [
 {id:"morning",tab:"De manhã",title:"O primeiro café do dia.",text:"Pão fresco e um café para começar sem correria. Dá para levar na mão ou sentar por uns minutos.",link:"Fale com a Deli"},
 {id:"afternoon",tab:"À tarde",title:"A pausa entre um compromisso e outro.",text:"Uma mesa livre, um café e um pouco de silêncio no meio da tarde.",link:"Fale com a Deli"},
 {id:"evening",tab:"À noite",title:"A parada antes de casa.",text:"No caminho de volta, o pão para a mesa e o que faltava no empório.",link:"Peça pelo WhatsApp"}
] as const;
export const ribbonWords = ["O pão de todo dia.","O café sem pressa.","A sua Deli.","A mesa está posta.","Trinta anos em Salvador."] as const;
export const orderSteps = [
 {n:"01",text:"Você escolhe a unidade mais perto."},
 {n:"02",text:"A conversa abre já escrita, é só enviar."},
 {n:"03",text:"A equipe confirma cardápio, entrega e horário."}
] as const;
