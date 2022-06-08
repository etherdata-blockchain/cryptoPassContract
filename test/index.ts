import { expect } from "chai";
import { ethers } from "hardhat";
import crypto from "crypto";

describe("CryptoPass", function () {
  const encryptData = (data: any): [crypto.KeyObject, string] => {
    const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
      modulusLength: 2048,
    });
    const encrypted = crypto.publicEncrypt(
      {
        key: publicKey,
        padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      },
      Buffer.from(JSON.stringify(data))
    );
    return [privateKey, encrypted.toString("base64")];
  };

  it("Should add secret without problem", async function () {
    const CryptoPass = await ethers.getContractFactory("CryptoPass");
    const cryptoPass = await CryptoPass.deploy();

    expect(await cryptoPass.getSecretSize()).equal(0);
    const data = {
      password: "test",
    };
    const [privateKey, encrypted] = encryptData(data);
    await cryptoPass.addSecret(encrypted);
    expect(await cryptoPass.getSecretSize()).equal(1);

    const retrieved = await cryptoPass.getSecretInRange(0, 2);
    expect(retrieved.length).equal(1);

    const decrypted = JSON.parse(
      crypto
        .privateDecrypt(
          {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
          },
          Buffer.from(retrieved[0], "base64")
        )
        .toString()
    );
    expect(decrypted).deep.equal(data);
  });
});
