#!/usr/bin/env node

/**
 * Générateur d'instructions automatiques pour la création des champs Airtable
 * Ce script génère un guide détaillé et précis pour créer chaque champ manquant
 */

const dotenv = require("dotenv");
const path = require("path");
const fs = require("fs");

// Charger les variables d'environnement
dotenv.config({ path: path.resolve(__dirname, "../.env") });

/**
 * Exécuter le script de test et capturer la sortie
 */
function runTestScript() {
  return new Promise((resolve, reject) => {
    const { spawn } = require("child_process");
    const testProcess = spawn("npm", ["run", "test:airtable-config"], {
      cwd: path.resolve(__dirname, ".."),
      stdio: "pipe",
    });

    let output = "";
    let errorOutput = "";

    testProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    testProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    testProcess.on("close", (code) => {
      resolve({ output, errorOutput, code });
    });

    testProcess.on("error", (error) => {
      reject(error);
    });
  });
}

/**
 * Parser la sortie du test pour extraire les champs manquants
 */
function parseMissingFields(output) {
  const missingFields = {
    packs: [],
    products: [],
    orders: [],
  };

  const lines = output.split("\n");
  let currentTable = null;
  let inMissingSection = false;

  for (const line of lines) {
    // Détecter les sections de champs à créer
    if (line.includes("Table Packs - Champs à créer:")) {
      currentTable = "packs";
      inMissingSection = true;
      continue;
    } else if (line.includes("Table Products - Champs à créer:")) {
      currentTable = "products";
      inMissingSection = true;
      continue;
    } else if (line.includes("Table Orders - Champs à créer:")) {
      currentTable = "orders";
      inMissingSection = true;
      continue;
    }

    // Fin de section
    if (line.startsWith("💡") || line.startsWith("⠙")) {
      inMissingSection = false;
      currentTable = null;
      continue;
    }

    // Parser les champs manquants
    if (inMissingSection && currentTable && line.trim().startsWith("- ")) {
      const match = line.match(/- (.+) \((.+)\)/);
      if (match) {
        const [, fieldName, fieldType] = match;
        let instructions = "";

        // Générer des instructions spécifiques selon le type
        switch (fieldType.toLowerCase()) {
          case "text":
            instructions = `Type: Single line text`;
            break;
          case "url":
            instructions = `Type: URL`;
            break;
          case "email":
            instructions = `Type: Email`;
            break;
          case "phone":
            instructions = `Type: Phone number`;
            break;
          case "date":
            instructions = `Type: Date`;
            break;
          case "long text":
            instructions = `Type: Long text`;
            break;
          case "single select: pending, paid, shipped, delivered":
            instructions = `Type: Single select, Options: Pending, Paid, Shipped, Delivered`;
            break;
          default:
            instructions = `Type: ${fieldType}`;
        }

        missingFields[currentTable].push({
          name: fieldName,
          type: fieldType,
          instructions,
        });
      }
    }
  }

  return missingFields;
}

/**
 * Générer le guide HTML interactif
 */
function generateInteractiveGuide(missingFields) {
  const html = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Guide de Configuration Airtable - Fournitures Scolaires</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background: #f8fafc;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 12px;
            margin-bottom: 30px;
            text-align: center;
        }
        .table-section {
            background: white;
            border-radius: 12px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .table-title {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
            color: #2d3748;
            border-bottom: 3px solid #4299e1;
            padding-bottom: 10px;
        }
        .field-item {
            background: #f7fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            position: relative;
        }
        .field-name {
            font-weight: bold;
            color: #2b6cb0;
            font-size: 18px;
            margin-bottom: 8px;
        }
        .field-instructions {
            color: #4a5568;
            margin-bottom: 10px;
        }
        .step-list {
            background: #edf2f7;
            padding: 15px;
            border-radius: 6px;
            margin-top: 10px;
        }
        .step-list ol {
            margin: 0;
            padding-left: 20px;
        }
        .step-list li {
            margin-bottom: 5px;
        }
        .checkbox-container {
            text-align: right;
            margin-top: 10px;
        }
        .field-checkbox {
            transform: scale(1.5);
            margin-left: 10px;
        }
        .progress-bar {
            background: #e2e8f0;
            height: 20px;
            border-radius: 10px;
            margin: 20px 0;
            overflow: hidden;
        }
        .progress-fill {
            background: linear-gradient(90deg, #48bb78, #38a169);
            height: 100%;
            width: 0%;
            transition: width 0.3s ease;
        }
        .progress-text {
            text-align: center;
            margin-top: 10px;
            font-weight: bold;
        }
        .completion-message {
            background: linear-gradient(135deg, #48bb78, #38a169);
            color: white;
            padding: 20px;
            border-radius: 12px;
            text-align: center;
            margin-top: 30px;
            display: none;
        }
        .next-steps {
            background: #ebf8ff;
            border: 1px solid #bee3f8;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        .next-steps h3 {
            color: #2b6cb0;
            margin-top: 0;
        }
        .command-box {
            background: #1a202c;
            color: #e2e8f0;
            padding: 15px;
            border-radius: 6px;
            font-family: 'Monaco', 'Menlo', monospace;
            margin: 10px 0;
        }
        .airtable-link {
            display: inline-block;
            background: #4299e1;
            color: white;
            padding: 12px 24px;
            border-radius: 6px;
            text-decoration: none;
            margin: 10px 5px;
            font-weight: bold;
        }
        .airtable-link:hover {
            background: #3182ce;
        }
        .warning {
            background: #fed7d7;
            border: 1px solid #fc8181;
            color: #c53030;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        .status-indicator {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-pending { background: #ed8936; }
        .status-complete { background: #48bb78; }
        @media (max-width: 768px) {
            body { padding: 10px; }
            .table-section { padding: 15px; }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 Guide de Configuration Airtable</h1>
        <p>Configuration automatique des champs pour votre e-commerce de fournitures scolaires</p>
        <p><strong>Base ID:</strong> ${
          process.env.AIRTABLE_BASE_ID || "Non configuré"
        }</p>
    </div>

    <div class="progress-bar">
        <div class="progress-fill" id="progressBar"></div>
    </div>
    <div class="progress-text" id="progressText">0% complété</div>

    ${Object.entries(missingFields)
      .map(([tableName, fields]) => {
        if (fields.length === 0) {
          return `
        <div class="table-section">
            <div class="table-title">
                <span class="status-indicator status-complete"></span>
                📦 Table ${
                  tableName.charAt(0).toUpperCase() + tableName.slice(1)
                }
            </div>
            <p style="color: #48bb78; font-weight: bold;">✅ Tous les champs requis sont présents !</p>
        </div>`;
        }

        return `
      <div class="table-section">
          <div class="table-title">
              <span class="status-indicator status-pending"></span>
              📦 Table ${tableName.charAt(0).toUpperCase() + tableName.slice(1)}
          </div>
          <p><strong>${fields.length} champ(s) à créer</strong></p>
          
          <a href="https://airtable.com/${process.env.AIRTABLE_BASE_ID}/${
          tableName === "products"
            ? process.env.AIRTABLE_PRODUCTS_TABLE
            : tableName === "packs"
            ? process.env.AIRTABLE_PACKS_TABLE
            : process.env.AIRTABLE_ORDERS_TABLE
        }" 
             class="airtable-link" target="_blank">
             Ouvrir la table ${tableName}
          </a>
          
          ${fields
            .map(
              (field, index) => `
          <div class="field-item">
              <div class="field-name">${field.name}</div>
              <div class="field-instructions">${field.instructions}</div>
              
              <div class="step-list">
                  <strong>Étapes à suivre:</strong>
                  <ol>
                      <li>Cliquez sur le bouton "+" à droite des colonnes existantes</li>
                      <li>Nommez le champ: <strong>${field.name}</strong></li>
                      <li>Sélectionnez le type: <strong>${field.instructions.replace(
                        "Type: ",
                        ""
                      )}</strong></li>
                      ${
                        field.instructions.includes("Options:")
                          ? `<li>Ajoutez les options: <strong>${
                              field.instructions.split("Options: ")[1]
                            }</strong></li>`
                          : ""
                      }
                      <li>Cliquez sur "Créer le champ"</li>
                  </ol>
              </div>
              
              <div class="checkbox-container">
                  <label>
                      <input type="checkbox" class="field-checkbox" 
                             onchange="updateProgress()" 
                             data-table="${tableName}" 
                             data-field="${field.name}">
                      Terminé
                  </label>
              </div>
          </div>
          `
            )
            .join("")}
      </div>`;
      })
      .join("")}

    <div class="completion-message" id="completionMessage">
        <h2>🎉 Configuration terminée !</h2>
        <p>Tous les champs ont été créés. Vous pouvez maintenant synchroniser vos données.</p>
    </div>

    <div class="next-steps">
        <h3>📋 Prochaines étapes</h3>
        <ol>
            <li><strong>Vérifier la configuration:</strong>
                <div class="command-box">npm run test:airtable-config</div>
            </li>
            <li><strong>Synchroniser vos données:</strong>
                <div class="command-box">npm run sync:tables</div>
            </li>
            <li><strong>Vérifier la synchronisation:</strong>
                <div class="command-box">npm run inspect:airtable</div>
            </li>
        </ol>
    </div>

    <script>
        function updateProgress() {
            const checkboxes = document.querySelectorAll('.field-checkbox');
            const checkedBoxes = document.querySelectorAll('.field-checkbox:checked');
            const totalFields = checkboxes.length;
            const completedFields = checkedBoxes.length;
            
            const percentage = totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 100;
            
            document.getElementById('progressBar').style.width = percentage + '%';
            document.getElementById('progressText').textContent = percentage + '% complété (' + completedFields + '/' + totalFields + ' champs)';
            
            // Afficher le message de completion
            if (percentage === 100) {
                document.getElementById('completionMessage').style.display = 'block';
                
                // Mettre à jour les indicateurs de status
                document.querySelectorAll('.status-indicator').forEach(indicator => {
                    indicator.className = 'status-indicator status-complete';
                });
            }
            
            // Sauvegarder l'état dans localStorage
            const state = {};
            checkboxes.forEach(checkbox => {
                const key = checkbox.dataset.table + '_' + checkbox.dataset.field;
                state[key] = checkbox.checked;
            });
            localStorage.setItem('airtable_setup_progress', JSON.stringify(state));
        }
        
        // Restaurer l'état depuis localStorage
        window.addEventListener('load', function() {
            const savedState = localStorage.getItem('airtable_setup_progress');
            if (savedState) {
                const state = JSON.parse(savedState);
                document.querySelectorAll('.field-checkbox').forEach(checkbox => {
                    const key = checkbox.dataset.table + '_' + checkbox.dataset.field;
                    if (state[key]) {
                        checkbox.checked = true;
                    }
                });
                updateProgress();
            }
        });
    </script>
</body>
</html>`;

  return html;
}

/**
 * Fonction principale
 */
async function main() {
  console.log(
    "🔍 Génération du guide interactif de configuration Airtable...\n"
  );

  try {
    // Exécuter le test de configuration
    console.log("📋 Analyse de la configuration actuelle...");
    const testResult = await runTestScript();

    if (testResult.code !== 0) {
      console.error("❌ Erreur lors du test de configuration");
      console.error(testResult.errorOutput);
      return;
    }

    // Parser les champs manquants
    const missingFields = parseMissingFields(testResult.output);

    // Calculer le total des champs manquants
    const totalMissing = Object.values(missingFields).reduce(
      (sum, fields) => sum + fields.length,
      0
    );

    console.log(`📊 Analyse terminée:`);
    console.log(`   - Packs: ${missingFields.packs.length} champs manquants`);
    console.log(
      `   - Products: ${missingFields.products.length} champs manquants`
    );
    console.log(`   - Orders: ${missingFields.orders.length} champs manquants`);
    console.log(`   - Total: ${totalMissing} champs manquants`);

    if (totalMissing === 0) {
      console.log(
        "\n🎉 Aucun champ manquant ! Votre configuration est complète."
      );
      console.log(
        "💡 Vous pouvez lancer la synchronisation: npm run sync:tables"
      );
      return;
    }

    // Générer le guide HTML
    console.log("\n📝 Génération du guide interactif...");
    const html = generateInteractiveGuide(missingFields);

    // Sauvegarder le guide
    const guidePath = path.join(__dirname, "..", "airtable-setup-guide.html");
    fs.writeFileSync(guidePath, html, "utf8");

    console.log(`✅ Guide généré: ${guidePath}`);
    console.log("\n📋 Instructions:");
    console.log(
      "1. Ouvrez le fichier airtable-setup-guide.html dans votre navigateur"
    );
    console.log("2. Suivez les instructions pour chaque champ manquant");
    console.log("3. Cochez les cases au fur et à mesure");
    console.log("4. Une fois terminé, lancez: npm run test:airtable-config");
    console.log("5. Puis: npm run sync:tables");

    // Essayer d'ouvrir automatiquement le guide
    try {
      const { spawn } = require("child_process");
      spawn("open", [guidePath], { stdio: "ignore" });
      console.log("\n🌐 Guide ouvert dans votre navigateur par défaut");
    } catch (error) {
      console.log(
        "\n💡 Ouvrez manuellement le fichier airtable-setup-guide.html"
      );
    }
  } catch (error) {
    console.error("❌ Erreur lors de la génération du guide:", error.message);
  }
}

// Exécuter le script
if (require.main === module) {
  main().catch(console.error);
}
