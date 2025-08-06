const fs = require('fs');
const path = require('path');
const { generateBMFont } = require('msdf-bmfont-xml');

// Configurações à prova de erros
const config = {
  fontPath: path.join(__dirname, 'assets', 'fonts', 'Exo2-Regular.ttf'),
  outputDir: path.join(__dirname, 'assets', 'fonts', 'generated'),
  charset: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 .,!?;:()-—'
};

console.log('🔍 Verificando fonte em:', config.fontPath);

// Verificação adicional do arquivo
if (!fs.existsSync(config.fontPath)) {
  console.error('❌ Arquivo da fonte não encontrado!');
  console.log('👉 Verifique se o arquivo existe neste caminho exato:');
  console.log(config.fontPath);
  process.exit(1);
}

generateBMFont(
  config.fontPath,
  {
    outputType: 'json',
    charset: config.charset,
    textureSize: [512, 512],
    fontSize: 42,
    distanceRange: 3
  },
  (error, textures, fontData) => {
    if (error) {
      console.error('❌ Falha na geração:', error.message);
      return;
    }

    // Criação robusta da pasta
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // Salvamento com tratamento de erros
    try {
      textures.forEach((texture, index) => {
        fs.writeFileSync(
          path.join(config.outputDir, `exo2-${index}.png`),
          texture
        );
      });

      fs.writeFileSync(
        path.join(config.outputDir, 'exo2-font.json'),
        fontData
      );

      console.log('✅ Sucesso! Arquivos criados em:');
      console.log('📂', config.outputDir);
      console.log('├── exo2-0.png');
      console.log('└── exo2-font.json');

    } catch (writeError) {
      console.error('❌ Erro ao salvar arquivos:', writeError.message);
    }
  }
);