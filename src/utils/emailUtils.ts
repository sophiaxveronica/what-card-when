import { CategoryWithBestCreditCard } from '../types';
  import { capitalizeWords, lowercaseWords } from './stringUtils';
  
  // This is the email that we send users when they use What Card When to generate results
  export function generateEmail(results: CategoryWithBestCreditCard[], name: string, card_names: string[]): string {
      const categoriesWithoutBestCard: string[] = [];
    
      const categoryHtml = results.map((category) => {
        if (category.bestCards && category.bestCards.length > 0 && category.category !== "other_spending") {
          return `
            <div style="background-color: #f9f9f9; border: 1px solid #ccc; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
              <h3 style="color: #333; font-size: 18px; margin-top: 0; margin-bottom: 10px;">${capitalizeWords(category.category)}</h3>
              ${category.bestCards.map((bestCard) => `
                <div>
                  <p style="color: #333;">Best card: <span style="font-weight: bold; color: #28a745;">${bestCard.company} - ${bestCard.card_name}</span></p>
                  <p style="color: #333;">
                    ${bestCard.cash_back_pct ? 'Cash back: ' : 'Points per $:'}
                    <span style="font-weight: bold; color: #28a745;">
                      ${bestCard.cash_back_pct ? `${bestCard.cash_back_pct}%` : bestCard.points_per_dollar}
                    </span>
                  </p>
                  <p style="color: #333;">Fine print: <span style="font-size: small; color: #555;">${bestCard.fine_print}</span></p>
                </div>
              `).join('')}
            </div>
          `;
        }
        categoriesWithoutBestCard.push(category.category);
        return null;
      }).join('');
    
      const otherSpendingCategory = results.find(category => category.category === "other_spending");
      const bestCards = otherSpendingCategory?.bestCards;
    
      let otherSpendingHtml = '';
      if (bestCards?.length === 1) {
        otherSpendingHtml = `
          <p style="color: #333;">
            For the remaining categories (${categoriesWithoutBestCard.map(lowercaseWords).join(', ')}) and other spending, your best card is <span style="font-weight: bold; color: #28a745;">${bestCards[0].card_name}</span>, which offers <span style="font-weight: bold; color: #28a745;">${bestCards[0].cash_back_pct ? `${bestCards[0].cash_back_pct}% cash back` : `${bestCards[0].points_per_dollar} points per $`}</span>.
          </p>
        `;
      } else if (bestCards?.length && bestCards?.length > 1) {
        otherSpendingHtml = `
          <p style="color: #333;">
            For the remaining categories (${categoriesWithoutBestCard.map(lowercaseWords).join(', ')}) and other spending, your best cards are: ${bestCards.map((bestCard, index) => `
              <span style="font-weight: bold; color: #28a745;">${bestCard.card_name}</span>${index < bestCards.length - 1 ? ', ' : ''}
            `).join('')}.
          </p>
        `;
      } else {
        otherSpendingHtml = `
          <p style="color: #333;">
            No rewards card found for ${categoriesWithoutBestCard.map(lowercaseWords).join(', ')} and other spending.
          </p>
        `;
      }

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #333; font-size: 18px; margin: 0;">Hi ${name}!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #333; font-size: 18px; margin: 0;">Thanks for using What Card When.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #333; font-size: 18px; margin: 0;">Here's what we recommend given your cards:<br>${card_names.join(', ')}.</p>
          </td>
        </tr>
      </table>      
      <h2 style="color: #333; font-size: 24px; margin-bottom: 20px;">Your Optimal Card Usage:</h2>
                ${categoryHtml}
          ${otherSpendingHtml}

      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #333; font-size: 18px; margin: 0;">We're actively building What Card When, so please let us know what you think!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #333; font-size: 18px; margin: 0;">We are a team of 2 engineers and we read every email💕</p>
          </td>
        </tr>
      </table>
    </div>
  `;
 }