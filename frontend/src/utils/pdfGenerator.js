/**
 * Generates and triggers browser PDF print/export dialog for InsureWise Actuarial Quotes.
 */
export const generatePDFReport = ({ prediction, modelVersion = '1.0.0', date, inputFeatures = {}, explanation = {} }) => {
  const annual = prediction || 0;
  const monthly = (annual / 12).toFixed(2);
  const formattedDate = date ? new Date(date).toLocaleString() : new Date().toLocaleString();

  let riskTier = 'Standard Risk Profile';
  if (annual > 25000) riskTier = 'High Risk Profile';
  else if (annual > 12000) riskTier = 'Moderate Risk Profile';

  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups for this site to download the PDF report.');
    return;
  }

  const featuresList = Object.entries(inputFeatures || {}).map(([k, v]) => `
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 6px;">
      <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 600;">${k.replace(/_/g, ' ')}</div>
      <div style="color: #0f172a; font-size: 13px; font-weight: 700; margin-top: 2px;">${v}</div>
    </div>
  `).join('');

  const shapEntries = Object.entries(explanation || {}).slice(0, 10).map(([feat, val]) => {
    const numVal = Number(val);
    const isPos = numVal >= 0;
    return `
      <tr>
        <td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0; text-transform: capitalize;">${feat.replace(/_/g, ' ')}</td>
        <td style="padding: 6px 12px; border-bottom: 1px solid #e2e8f0; text-align: right; font-weight: bold; color: ${isPos ? '#16a34a' : '#dc2626'};">
          ${isPos ? '+' : ''}$${numVal.toFixed(2)}
        </td>
      </tr>
    `;
  }).join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>InsureWise_AI_Actuarial_Quote_${Date.now()}</title>
      <style>
        @page { size: A4; margin: 15mm; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; margin: 0; padding: 20px; line-height: 1.5; }
        .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0f172a; padding-bottom: 12px; margin-bottom: 20px; }
        .title { font-size: 22px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 0.5px; }
        .subtitle { font-size: 12px; color: #64748b; margin-top: 2px; }
        .quote-box { background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; padding: 16px; display: flex; justify-content: space-between; margin-bottom: 24px; }
        .premium-val { font-size: 28px; font-weight: 900; color: #0f172a; font-family: monospace; }
        .section-title { font-size: 13px; font-weight: 700; text-transform: uppercase; color: #0f172a; margin-bottom: 10px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
        .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 24px; }
        th { text-align: left; padding: 8px 12px; background: #f1f5f9; color: #475569; font-weight: 700; text-transform: uppercase; font-size: 10px; }
        .footer { font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 30px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <div class="title">InsureWise AI</div>
          <div class="subtitle">Actuarial Risk Assessment & Quote Report</div>
        </div>
        <div style="text-align: right; font-size: 11px; color: #64748b;">
          <div><strong>Date:</strong> ${formattedDate}</div>
          <div><strong>Model Version:</strong> XGBoost v${modelVersion}</div>
        </div>
      </div>

      <div class="quote-box">
        <div>
          <div style="font-size: 11px; color: #475569; font-weight: 700; text-transform: uppercase;">Annual Premium Quote</div>
          <div class="premium-val">$${annual.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 11px; color: #475569; font-weight: 700; text-transform: uppercase;">Monthly Installment</div>
          <div style="font-size: 20px; font-weight: 700; color: #334155; font-family: monospace; margin-top: 4px;">$${Number(monthly).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          <div style="font-size: 11px; font-weight: bold; color: #0284c7; margin-top: 4px;">${riskTier}</div>
        </div>
      </div>

      ${Object.keys(inputFeatures || {}).length > 0 ? `
        <div class="section-title">Evaluated Customer Health & Demographic Metrics</div>
        <div class="grid">
          ${featuresList}
        </div>
      ` : ''}

      ${Object.keys(explanation || {}).length > 0 ? `
        <div class="section-title">SHAP Feature Cost Attributions</div>
        <table>
          <thead>
            <tr>
              <th>Risk Factor / Feature</th>
              <th style="text-align: right;">Impact on Annual Quote ($ USD)</th>
            </tr>
          </thead>
          <tbody>
            ${shapEntries}
          </tbody>
        </table>
      ` : ''}

      <div class="footer">
        Confidential Actuarial Report generated by InsureWise AI Engine. Powered by XGBoost and SHAP TreeExplainer.
      </div>

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 400);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.open();
  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
