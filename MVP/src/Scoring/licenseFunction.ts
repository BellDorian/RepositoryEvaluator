import { OpenAI } from "openai";
import { Repository } from "../Types/DataTypes";
import { resolve } from "path";

/**
 * Tim Carpenter
 *
 * Evaluates the license compatibility score of a repository using the OpenAI API
 *
 * @template T - The type of the data stored in the repository (generic)
 * @param {Repository<T>} repo - The repository to be evaluated
 * @returns 0 - License is incompatible
 * @returns 1 - License is compatible
 *
 */
export function licenseFunction<T>(repo: Repository<T>): number {
  const licenseName = repo.queryResult?.licenseInfo?.name;
  
  if(licenseName == 'MIT License' || licenseName == 'GNU Affero General Public License v3.0' 
    || licenseName == 'Mozilla Public License 2.0' || licenseName == 'Artistic License 2.0'){
    return 1;
  }
  else if(licenseName == 'Apache License 2.0'){
    return 0;
  }
  else if(licenseName == 'Other'){
    return 0.5;
  }
  else{
    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY, // Make sure to set API key in environment variables
    });
    var result: number;
    var answer;

    try {
      openai.chat.completions.create({
        model: "gpt-4",
        messages: [{ role: "user", content: `Is LGPL v2.1 compatible with ${licenseName}? Answer using yes or no` }],
      })
      .then(response => {
        answer = response.choices[0]?.message?.content;

        if(answer == 'Yes' || answer == 'Yes.'){
          return 0;
        }
        else if(answer == 'No' || answer == 'No.'){
          return 0;
        }
        else{
          return 0.5; // If no concrete answer can be found
        }
    })

    } catch (error) {
      console.error("Error using API:", error);
    }
  }

  return 0;
}