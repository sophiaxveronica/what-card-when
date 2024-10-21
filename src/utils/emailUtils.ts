import { CategoryWithBestCreditCard } from '../types';
import { capitalizeWords } from './stringUtils';

// This is the email that we send users when they use What Card When to generate results
export function generateEmail(results: CategoryWithBestCreditCard[], name: string, card_names: string[]): string {

    return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Hi ${name}!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Thanks for using What Card When.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Here's what we recommend given your cards:<br>${card_names.join(', ')}.</p>
          </td>
        </tr>
      </table>      
      <h2 style="color: #006400; font-size: 24px; margin-bottom: 20px;">Your Optimal Card Usage:</h2>

      ${results.map((category, index) => `
        <div style="background-color: #ffffff; border: 2px solid #006400; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
          <h3 style="color: #00ff00; font-size: 18px; margin-top: 0; margin-bottom: 10px;">${capitalizeWords(category.category)}</h3>
          ${category.bestCards && category.bestCards.length > 0 ? 
            category.bestCards.map((bestCard) => `
              <div> <!-- Added a div to wrap best card details -->
                Best Card: ${bestCard.company} - ${bestCard.card_name}<br />
                ${bestCard.cash_back_pct ? 'Cash back: ' : 'Points per dollar: '}
                ${bestCard.cash_back_pct ? `${bestCard.cash_back_pct}%` : bestCard.points_per_dollar}<br />
                Fine Print: ${bestCard.fine_print}<br />
                ${category.bestCards && category.bestCards.length > 1 ? '<br />' : ''} <!-- Corrected the condition -->
              </div>
            `).join('') : 
            'No card available for this category.'}
        </div>
      `).join('')}

      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">We're actively building What Card When, so please let us know what you think!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">We are a team of 2 engineers and we read every email💕</p>
          </td>
        </tr>
      </table>
    </div>
  `;
 }