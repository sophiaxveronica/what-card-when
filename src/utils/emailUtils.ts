import { SpendingCategory } from '../types';
import { capitalizeWords } from './stringUtils';

export function generateResultsEmail(results: SpendingCategory[], name: string, cards: { company: string; type: string }[]): string {
    const cardList = cards.map(card => `${card.company} ${card.type}`).join(', ');

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
            <p style="color: #006400; font-size: 18px; margin: 0;">Thanks for using WhatCardWhen.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Here's what we recommend for you given these inputted cards:<br>${cardList}.</p>
          </td>
        </tr>
      </table>      
      <h2 style="color: #006400; font-size: 24px; margin-bottom: 20px;">Your Optimal Card Usage:</h2>
      ${results.map((category, index) => `
        <div style="background-color: #ffffff; border: 2px solid #006400; border-radius: 10px; padding: 15px; margin-bottom: 15px;">
          <h3 style="color: #00ff00; font-size: 18px; margin-top: 0; margin-bottom: 10px;">${capitalizeWords(category.category)}</h3>
          ${category.bestCard
        ? `
              <p style="color: #006400; margin: 5px 0;">Best Card: <strong>${category.bestCard.company} - ${category.bestCard.type}</strong></p>
              <p style="color: #006400; margin: 5px 0;">Cashback: <strong>${category.bestCard.percentage}%</strong></p>
            `
        : `<p style="color: #ff0000; margin: 5px 0;">No card available for this category</p>`
      }
        </div>
      `).join('')}
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f0f8f0;">
      <table cellpadding="0" cellspacing="0" border="0" width="100%">
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">We're actively building WhatCardWhen.</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Let us know what you think!</p>
          </td>
        </tr>
        <tr>
          <td style="padding: 0 0 20px 0;">
            <p style="color: #006400; font-size: 18px; margin: 0;">Best,<br>the WCW team</p>
          </td>
        </tr>
      </table>
    </div>
  `;
 }