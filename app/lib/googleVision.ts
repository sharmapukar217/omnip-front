// import { CapacitorHttp } from "@capacitor/core";

/** base64 encoded image */
type Base64Image = "string";

/** google vison feature type */
type FeatureType =
  | "WEB_DETECTION"
  | "TEXT_DETECTION"
  | "LABEL_DETECTION"
  | "LANDMARK_DETECTION";

class GoogleVision {
  /**
   * @param imageUrl {string|Base64Image} Can be either base64 url encoded image or image url
   * @param featureType {FeatureType}
   */
  async #request<T>(
    imageUrl: string | Base64Image,
    featureType: FeatureType
  ): Promise<T | undefined> {
    return fetch("https://vision.googleapis.com/v1/images:annotate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": import.meta.env.NUXT_PUBLIC_GOOGLE_VISION_KEY
      },
      body: JSON.stringify({
        requests: [{ image: { content: imageUrl }, features: [{ type: featureType }] }]
      })
    })
      .then((respose) => respose.json())
      .then((data) => {
        return data.responses[0] as T;
      })
      .catch(() => undefined);
  }

  /**
   * @description Get the web detection from the provided image
   * @param imageUrl {string|Base64Image} Can be either base64 url encoded image or image url
   */
  async getWebDetection(imageUrl: string | Base64Image) {
    await this.#request(imageUrl, "WEB_DETECTION");
  }

  /**
   * @description Get the text detection (ocr) from the provided image
   * @param imageUrl {string|Base64Image} Can be either base64 url encoded image or image url
   */
  async getOcr(imageUrl: string | Base64Image) {
    const data = await this.#request<{ fullTextAnnotation: { text: string } }>(
      imageUrl,
      "TEXT_DETECTION"
    );

    return data?.fullTextAnnotation;
  }

  /**
   * @description Get the text detection (ocr) from the provided image
   * @param imageUrl {string|Base64Image} Can be either base64 url encoded image or image url
   */
  async getLandmark(imageUrl: string | Base64Image) {
    await this.#request(imageUrl, "TEXT_DETECTION");
  }
  // async getWebDetection() {}
}

export const googleVision = new GoogleVision();

// class GoogleVision {
//   async getWebDetection(base64: String) {
//     // on enlève l'entête du contenu image
//     base64 = base64.replace(/^data:image\/\w+;base64,/, "");
//     //'data:image/jpeg;base64,'
//     const data = {
//       requests: [
//         {
//           image: {
//             content: base64,
//           },
//           features: [{ maxResults: 10, type: "WEB_DETECTION" }],
//         },
//       ],
//     };
//     const config = {
//       //method: 'post',
//       //maxBodyLength: Infinity,
//       url: "https://vision.googleapis.com/v1/images:annotate?key=${impot.meta.env.NUXT_PUBLIC_GOOGLE_VISION_KEY}",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: data,
//     };

//     const response = await fetch("https://vision.googleapis.com/v1/images:annotate", {
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: {
//         requests: [
//           {
//             image: {
//               content: base64,
//             },
//             features: [{ maxResults: 10, type: "WEB_DETECTION" }],
//           },
//         ],
//       },
//     });
//     // const descriptions = response.data.responses[0].webDetection.webEntities;

//     return { descriptions };
//   }

// //   async getOcr(base64: String) {
// //     // on enlève l'entête du contenu image
// //     base64 = base64.replace(/^data:image\/\w+;base64,/, "");
// //     const data = {
// //       requests: [
// //         {
// //           image: {
// //             content: base64,
// //           },
// //           features: [{ maxResults: 10, type: "TEXT_DETECTION" }],
// //         },
// //       ],
// //     };

// //     const config = {
// //       //method: 'post',
// //       //maxBodyLength: Infinity,
// //       url: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDDeV2CsmGgLk8lQPVAfidwZIhQhivypB0",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       data: data,
// //     };

// //     const response = await CapacitorHttp.post(config);
// //     const ocr = response.data.responses[0].fullTextAnnotation;

// //     return { ocr };
// //   }

// //   async getLandmark(base64: String) {
// //     // on enlève l'entête du contenu image
// //     base64 = base64.replace(/^data:image\/\w+;base64,/, "");
// //     //'data:image/jpeg;base64,'
// //     const data = {
// //       requests: [
// //         {
// //           image: {
// //             content: base64,
// //           },
// //           features: [{ maxResults: 10, type: "LANDMARK_DETECTION" }],
// //         },
// //       ],
// //     };
// //     const config = {
// //       //method: 'post',
// //       //maxBodyLength: Infinity,
// //       url: "https://vision.googleapis.com/v1/images:annotate?key=AIzaSyDDeV2CsmGgLk8lQPVAfidwZIhQhivypB0",
// //       headers: {
// //         "Content-Type": "application/json",
// //       },
// //       data: data,
// //     };

// //     const response = await CapacitorHttp.post(config);
// //     const landmark = response.data.responses[0].landmarkAnnotations;

// //     return { landmark };
// //   }
// }
