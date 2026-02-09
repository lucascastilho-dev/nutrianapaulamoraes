function calcularTDEE() {
  let peso = +document.getElementById('peso').value;
  let altura = +document.getElementById('altura').value;
  let idade = +document.getElementById('idade').value;
  let sexo = document.getElementById('sexo').value;
  let atividade = +document.getElementById('atividade').value;

  let tmb = sexo === "m"
    ? (10 * peso) + (6.25 * altura) - (5 * idade) + 5
    : (10 * peso) + (6.25 * altura) - (5 * idade) - 161;
	
	 


  let tdee = Math.round(tmb * atividade);
  simularComposicaoCorporal(tdee);
}
function simularComposicaoCorporal(tdee) {

  const meta = document.getElementById('meta').value;

  let caloriasAlvo = tdee;
  let variacaoDiaria = 0;

  if (meta === 'perder') {
    variacaoDiaria = -500; // déficit seguro
  } 
  else if (meta === 'ganhar') {
    variacaoDiaria = 400; // superávit limpo
  } 
  else {
    variacaoDiaria = 0; // manter
  }

  caloriasAlvo = tdee + variacaoDiaria;

  // 7700 kcal ≈ 1kg de gordura
  const variacaoMensalKg = ((variacaoDiaria * 30) / 7700).toFixed(2);
  const variacao3MesesKg = (variacaoMensalKg * 3).toFixed(2);
  const variacao6MesesKg = (variacaoMensalKg * 6).toFixed(2);

  let textoMeta = '';

  if (meta === 'perder') {
    textoMeta = 'perda de gordura';
  } else if (meta === 'ganhar') {
    textoMeta = 'ganho de massa magra';
  } else {
    textoMeta = 'manutenção da composição corporal';
  }

  document.getElementById('resultadoTDEE').innerHTML = `
    Seu gasto calórico diário estimado é <b>${tdee} kcal</b>.<br><br>

    Para objetivo de <b>${textoMeta}</b>, sua ingestão diária recomendada é
    <b>${caloriasAlvo} kcal</b>.<br><br>

    Projeção estimada:<br>
    • 1 mês: <b>${variacaoMensalKg} kg</b><br>
    • 3 meses: <b>${variacao3MesesKg} kg</b><br>
    • 6 meses: <b>${variacao6MesesKg} kg</b>
  `;
}

function calcularIMC() {
  let peso = +document.getElementById('pesoImc').value;
  let altura = +document.getElementById('alturaImc').value / 100;
  let imc = (peso / (altura * altura)).toFixed(1);

  let classificacao = imc < 18.5 ? "Abaixo do peso" :
    imc < 25 ? "Peso ideal" :
    imc < 30 ? "Sobrepeso" : "Obesidade";

  document.getElementById('resultadoIMC').innerHTML =
    `IMC: <b>${imc}</b> — ${classificacao}`;
}

function calcularMacros() {
  let cal = +document.getElementById('caloriasMacros').value;
  let obj = document.getElementById('objetivoMacros').value;

  let p, c, g;
  if(obj === "cut") { p=0.4; c=0.35; g=0.25; }
  if(obj === "manut") { p=0.3; c=0.45; g=0.25; }
  if(obj === "bulk") { p=0.3; c=0.5; g=0.2; }

  document.getElementById('resultadoMacros').innerHTML =
    `Proteína: <b>${Math.round((cal*p)/4)}g</b><br>
     Carboidratos: <b>${Math.round((cal*c)/4)}g</b><br>
     Gorduras: <b>${Math.round((cal*g)/9)}g</b>`;
}

function calcularAgua() {
  let peso = +document.getElementById('pesoAgua').value;
  let agua = (peso * 35) / 1000;
  document.getElementById('resultadoAgua').innerHTML =
    `Você deve beber cerca de <b>${agua.toFixed(2)} litros</b> por dia.`;
}

function calcularProteina() {
  let peso = +document.getElementById('pesoProt').value;
  let prot = peso * 2;
  document.getElementById('resultadoProteina').innerHTML =
    `Proteína ideal: <b>${prot}g por dia</b>.`;
}

function calcularPesoIdeal() {
  let altura = +document.getElementById('alturaIdeal').value / 100;
  let pesoIdeal = (22 * (altura * altura)).toFixed(1);
  let atual = +document.getElementById('pesoAtualIdeal').value;

  document.getElementById('resultadoPesoIdeal').innerHTML =
    `Peso ideal estimado: <b>${pesoIdeal} kg</b><br>
     Diferença atual: <b>${(atual - pesoIdeal).toFixed(1)} kg</b>.`;
}

function calcularIdadeMetabolica() {
  let idade = +document.getElementById('idadeMeta').value;
  let tdee = +document.getElementById('tdeeMeta').value;

  let idadeCalc = Math.round(idade * (2000 / tdee));

  document.getElementById('resultadoIdadeMeta').innerHTML =
    `Sua idade metabólica estimada é <b>${idadeCalc} anos</b>.`;
}
