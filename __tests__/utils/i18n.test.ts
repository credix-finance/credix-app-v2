import loadI18nMessages, { getLanguagePath } from "@utils/i18n.utils";
import fs from "fs/promises";

const TEST_LOCALE = "test-locale";
const TEST_TRANSLATION_DATA = {
	test: "translation of test",
};

const createDummyTranslationFile = async () => {
	const languagePath = getLanguagePath(TEST_LOCALE);
	const translationData = JSON.stringify(TEST_TRANSLATION_DATA);

	await fs.writeFile(languagePath, translationData);
};

const deleteDummyTranslationFile = async () => {
	const languagePath = getLanguagePath(TEST_LOCALE);
	await fs.rm(languagePath);
};

describe("Messages", () => {
	beforeAll(async () => {
		return await createDummyTranslationFile();
	});

	afterAll(async () => {
		return deleteDummyTranslationFile();
	});

	it("should return an empty object when the given locale is the same as the default", async () => {
		const locale = "en";
		const defaultLocale = "en";
		const expected = {};

		const messages = await loadI18nMessages({ locale, defaultLocale });

		expect(messages).toStrictEqual(expected);
	});

	it("should return the language path", () => {
		const locale = "en";
		const languagePath = getLanguagePath(locale);

		// TODO: we should probably test the file system here
		expect(languagePath).toBeTruthy();
	});

	it("Should return the translations strings for a given locale", async () => {
		const locale = TEST_LOCALE;
		const defaultLocale = "en";
		const expected = TEST_TRANSLATION_DATA;

		const messages = await loadI18nMessages({ locale, defaultLocale });

		expect(messages).toStrictEqual(expected);
	});

	it("Should fail to load translation strings for languages that are not yet compiled", async () => {
		const locale = "not-compiled";
		const defaultLocale = "en";
		const expected = TEST_TRANSLATION_DATA;

		jest.spyOn(console, "error").mockImplementation(() => {});
		jest.spyOn(console, "info").mockImplementation(() => {});

		await loadI18nMessages({ locale, defaultLocale });

		expect(console.error).toBeCalled();
		expect(console.info).toBeCalled();
	});
});
