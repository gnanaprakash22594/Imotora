import { CreateInventoryLevelInput, ExecArgs } from "@medusajs/framework/types";
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils";
import {
  createWorkflow,
  transform,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresStep,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows";
import fs from "fs";
import path from "path";

const STOREFRONT_URL = (process.env.STOREFRONT_URL || "").replace(/\/$/, "");

const updateStoreCurrencies = createWorkflow(
  "update-store-currencies",
  (input: {
    supported_currencies: { currency_code: string; is_default?: boolean }[];
    store_id: string;
  }) => {
    const normalizedInput = transform({ input }, (data) => {
      return {
        selector: { id: data.input.store_id },
        update: {
          supported_currencies: data.input.supported_currencies.map(
            (currency) => ({
              currency_code: currency.currency_code,
              is_default: currency.is_default ?? false,
            })
          ),
        },
      };
    });

    const stores = updateStoresStep(normalizedInput);

    return new WorkflowResponse(stores);
  }
);

export default async function seedImotoraData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const link = container.resolve(ContainerRegistrationKeys.LINK);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT);
  const salesChannelModuleService = container.resolve(Modules.SALES_CHANNEL);
  const storeModuleService = container.resolve(Modules.STORE);

  const indiaCountries = ["in"];
  const intlCountries = ["us", "gb"];
  const allCountries = [...indiaCountries, ...intlCountries];

  logger.info("Seeding iMotora store data...");
  const [store] = await storeModuleService.listStores();
  let defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
    name: "iMotora Online Store",
  });

  if (!defaultSalesChannel.length) {
    defaultSalesChannel = await salesChannelModuleService.listSalesChannels({
      name: "Default Sales Channel",
    });
  }

  if (!defaultSalesChannel.length) {
    const { result: salesChannelResult } = await createSalesChannelsWorkflow(
      container
    ).run({
      input: {
        salesChannelsData: [
          {
            name: "iMotora Online Store",
          },
        ],
      },
    });
    defaultSalesChannel = salesChannelResult;
  }

  await updateStoreCurrencies(container).run({
    input: {
      store_id: store.id,
      supported_currencies: [
        {
          currency_code: "inr",
          is_default: true,
        },
        {
          currency_code: "usd",
        },
      ],
    },
  });

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "iMotora",
        default_sales_channel_id: defaultSalesChannel[0].id,
      },
    },
  });

  logger.info("Seeding iMotora regions (India INR & International USD)...");
  const { result: regionResult } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: indiaCountries,
          payment_providers: ["pp_system_default"],
        },
        {
          name: "International",
          currency_code: "usd",
          countries: intlCountries,
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  });
  const indiaRegion = regionResult.find((r) => r.currency_code === "inr")!;
  const intlRegion = regionResult.find((r) => r.currency_code === "usd")!;

  logger.info("Seeding tax regions...");
  await createTaxRegionsWorkflow(container).run({
    input: allCountries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
    })),
  });

  logger.info("Seeding stock location...");
  const { result: stockLocationResult } = await createStockLocationsWorkflow(
    container
  ).run({
    input: {
      locations: [
        {
          name: "iMotora Collector Vault - Mumbai",
          address: {
            city: "Mumbai",
            country_code: "IN",
            address_1: "Plot 42, Motorsport Industrial Park, Andheri East",
            postal_code: "400069",
          },
        },
      ],
    },
  });
  const stockLocation = stockLocationResult[0];

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        default_location_id: stockLocation.id,
      },
    },
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_provider_id: "manual_manual",
    },
  });

  logger.info("Seeding fulfillment & shipping options...");
  const shippingProfiles = await fulfillmentModuleService.listShippingProfiles({
    type: "default",
  });
  let shippingProfile = shippingProfiles.length ? shippingProfiles[0] : null;

  if (!shippingProfile) {
    const { result: shippingProfileResult } =
      await createShippingProfilesWorkflow(container).run({
        input: {
          data: [
            {
              name: "Default Collector Shipping Profile",
              type: "default",
            },
          ],
        },
      });
    shippingProfile = shippingProfileResult[0];
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "iMotora Pan-India & Global Delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India & International",
        geo_zones: [
          { country_code: "in", type: "country" },
          { country_code: "us", type: "country" },
          { country_code: "gb", type: "country" },
        ],
      },
    ],
  });

  await link.create({
    [Modules.STOCK_LOCATION]: {
      stock_location_id: stockLocation.id,
    },
    [Modules.FULFILLMENT]: {
      fulfillment_set_id: fulfillmentSet.id,
    },
  });

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Free Collector Shipping (Orders ₹999+)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Free Shipping",
          description: "Complimentary collector-grade bubble-wrapped shipping in 3-5 days.",
          code: "free-shipping",
        },
        prices: [
          { currency_code: "inr", amount: 0 },
          { currency_code: "usd", amount: 0 },
          { region_id: indiaRegion.id, amount: 0 },
          { region_id: intlRegion.id, amount: 0 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Standard Collector Shipping",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Standard",
          description: "Insured collector packaging. Delivered in 3-5 business days.",
          code: "standard",
        },
        prices: [
          { currency_code: "inr", amount: 99 },
          { currency_code: "usd", amount: 9 },
          { region_id: indiaRegion.id, amount: 99 },
          { region_id: intlRegion.id, amount: 9 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Express Insured Air Courier",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Express",
          description: "Priority air dispatch within 24-48 hours with full transit insurance.",
          code: "express",
        },
        prices: [
          { currency_code: "inr", amount: 249 },
          { currency_code: "usd", amount: 19 },
          { region_id: indiaRegion.id, amount: 249 },
          { region_id: intlRegion.id, amount: 19 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  });

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: {
      id: stockLocation.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  logger.info("Seeding publishable API key...");
  const { data: existingKeys } = await query.graph({
    entity: "api_key",
    fields: ["id", "token"],
    filters: {
      type: "publishable",
    },
  });

  let publishableApiKey = existingKeys?.[0];

  if (!publishableApiKey) {
    const {
      result: [publishableApiKeyResult],
    } = await createApiKeysWorkflow(container).run({
      input: {
        api_keys: [
          {
            title: "iMotora Storefront Key",
            type: "publishable",
            created_by: "",
          },
        ],
      },
    });
    publishableApiKey = publishableApiKeyResult;
  }

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: {
      id: publishableApiKey.id,
      add: [defaultSalesChannel[0].id],
    },
  });

  // Print Publishable API Key prominently for Vercel / production deployment
  logger.info("==========================================================")
  logger.info(`NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`)
  logger.info("==========================================================")

  // Automatically sync publishable key & default region to storefront .env.local (local dev)
  try {
    const envPath = path.resolve(
      process.cwd(),
      "..",
      "imotora-store-storefront",
      ".env.local"
    );
    if (fs.existsSync(envPath) && publishableApiKey.token) {
      let envContent = fs.readFileSync(envPath, "utf-8");
      envContent = envContent.replace(
        /^NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=.*$/m,
        `NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY=${publishableApiKey.token}`
      );
      envContent = envContent.replace(
        /^NEXT_PUBLIC_DEFAULT_REGION=.*$/m,
        `NEXT_PUBLIC_DEFAULT_REGION=in`
      );
      fs.writeFileSync(envPath, envContent, "utf-8");
      logger.info(
        `Synced NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY (${publishableApiKey.token}) to storefront .env.local`
      );
    }
  } catch (err) {
    logger.warn(`Could not auto-sync storefront .env.local: ${String(err)}`);
  }

  logger.info("Seeding iMotora product categories...");
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: [
        {
          name: "Diecast Cars",
          handle: "diecast-cars",
          description: "Precision scale die-cast model cars in 1:64, 1:43, and 1:18 scales.",
          is_active: true,
        },
        {
          name: "Racing Tracks",
          handle: "racing-tracks",
          description: "High-speed miniature slot car tracks, loops, and modular circuit sets.",
          is_active: true,
        },
        {
          name: "Display & Garage",
          handle: "display-garage",
          description: "LED acrylic display cases, multi-tier mini garages, and diorama mats.",
          is_active: true,
        },
        {
          name: "Collector Accessories",
          handle: "collector-accessories",
          description: "Die-cast keychains, display plinths, protective cases, and care kits.",
          is_active: true,
        },
      ],
    },
  });

  logger.info("Seeding iMotora collections...");
  const { result: collectionsResult } = await createCollectionsWorkflow(
    container
  ).run({
    input: {
      collections: [
        { title: "Featured Products", handle: "featured" },
        { title: "Motorsport", handle: "motorsport" },
        { title: "Classics", handle: "classics" },
        { title: "Supercars", handle: "supercars" },
        { title: "Racing Legends", handle: "racing-legends" },
        { title: "iMotora Originals", handle: "imotora-originals" },
      ],
    },
  });

  const catId = (handle: string) =>
    categoryResult.find((c) => c.handle === handle)!.id;
  const colId = (handle: string) =>
    collectionsResult.find((c) => c.handle === handle)!.id;

  logger.info("Seeding iMotora die-cast products...");
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Ferrari SF90 Stradale 1:64 Diecast Model",
          subtitle: "Rosso Corsa • Collector Plinth Edition",
          handle: "ferrari-sf90-stradale-1-64",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("featured"),
          description:
            "Officially styled Ferrari SF90 Stradale 1:64 scale precision die-cast model finished in lustrous Rosso Corsa paint. Features realistic rubber tires, detailed V8 hybrid engine bay through the rear glass, metallic brake calipers, and a numbered black acrylic collector display plinth.",
          weight: 220,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/prod-ferrari-sf90.jpg`,
          images: [
            { url: `${STOREFRONT_URL}/images/prod-ferrari-sf90.jpg` },
            { url: `${STOREFRONT_URL}/images/hero-ferrari.jpg` },
          ],
          metadata: {
            scale: "1:64",
            brand: "Bburago Signature / iMotora",
            material: "Die-Cast Metal & ABS",
            compare_at_price_inr: 2499,
            discount_badge: "20% OFF",
            featured_rank: 1,
            collection_tags: "supercars,featured",
          },
          options: [
            { title: "Scale", values: ["1:64 Scale", "1:43 Scale"] },
            { title: "Color", values: ["Rosso Corsa", "Giallo Modena"] },
          ],
          variants: [
            {
              title: "1:64 Scale / Rosso Corsa",
              sku: "IMT-FER-SF90-64-RED",
              options: { Scale: "1:64 Scale", Color: "Rosso Corsa" },
              prices: [
                { amount: 1999, currency_code: "inr" },
                { amount: 24, currency_code: "usd" },
              ],
            },
            {
              title: "1:64 Scale / Giallo Modena",
              sku: "IMT-FER-SF90-64-YEL",
              options: { Scale: "1:64 Scale", Color: "Giallo Modena" },
              prices: [
                { amount: 1999, currency_code: "inr" },
                { amount: 24, currency_code: "usd" },
              ],
            },
            {
              title: "1:43 Scale / Rosso Corsa",
              sku: "IMT-FER-SF90-43-RED",
              options: { Scale: "1:43 Scale", Color: "Rosso Corsa" },
              prices: [
                { amount: 3499, currency_code: "inr" },
                { amount: 42, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Hot Wheels Premium Car Culture",
          subtitle: "Metal/Metal • Real Riders Rubber Tires",
          handle: "hot-wheels-premium-car-culture",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("featured"),
          description:
            "Authentic Hot Wheels Premium Car Culture collector release featuring full Metal/Metal body and chassis construction, Real Riders rubber tires, and premium motorsport-inspired deco. Delivered in a crystal-clear collector blister pack.",
          weight: 160,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/prod-hotwheels-pack.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/prod-hotwheels-pack.jpg` }],
          metadata: {
            scale: "1:64",
            brand: "Hot Wheels Premium",
            material: "Full Die-Cast Metal/Metal",
            featured_rank: 2,
            collection_tags: "motorsport,featured",
          },
          options: [
            { title: "Edition", values: ["2-Pack Collector Set", "Single Blister"] },
          ],
          variants: [
            {
              title: "2-Pack Collector Set",
              sku: "IMT-HWP-CC-2PK",
              options: { Edition: "2-Pack Collector Set" },
              prices: [
                { amount: 899, currency_code: "inr" },
                { amount: 11, currency_code: "usd" },
              ],
            },
            {
              title: "Single Blister",
              sku: "IMT-HWP-CC-1PK",
              options: { Edition: "Single Blister" },
              prices: [
                { amount: 549, currency_code: "inr" },
                { amount: 7, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "TRACK 01 Racing Set (1:64 Scale)",
          subtitle: "Dual-Lane High-Speed Circuit + 2 Supercars",
          handle: "track-01-racing-set-1-64",
          category_ids: [catId("racing-tracks")],
          collection_id: colId("featured"),
          description:
            "Build, race, and compete with the iMotora TRACK 01 Racing Set. Includes 3.6 meters of snap-lock dual-lane track with banked turns, lap counter, dual speed controllers, and two 1:64 scale racing supercars ready out of the box.",
          weight: 1450,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/prod-track-set.jpg`,
          images: [
            { url: `${STOREFRONT_URL}/images/prod-track-set.jpg` },
            { url: `${STOREFRONT_URL}/images/cat-tracks.jpg` },
          ],
          metadata: {
            scale: "1:64",
            brand: "iMotora Track Systems",
            material: "High-Impact ABS & Metal Rails",
            featured_rank: 3,
            collection_tags: "racing-legends,featured",
          },
          options: [{ title: "Layout", values: ["Standard Circuit (3.6m)", "Pro Expansion (5.2m)"] }],
          variants: [
            {
              title: "Standard Circuit (3.6m)",
              sku: "IMT-TRK-01-STD",
              options: { Layout: "Standard Circuit (3.6m)" },
              prices: [
                { amount: 3499, currency_code: "inr" },
                { amount: 42, currency_code: "usd" },
              ],
            },
            {
              title: "Pro Expansion (5.2m)",
              sku: "IMT-TRK-01-PRO",
              options: { Layout: "Pro Expansion (5.2m)" },
              prices: [
                { amount: 4999, currency_code: "inr" },
                { amount: 59, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Lamborghini Huracán 1:64 Diecast Model",
          subtitle: "Verde Mantis Gold • Collector Edition",
          handle: "lamborghini-huracan-1-64",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("featured"),
          description:
            "Razor-sharp Italian engineering captured in 1:64 die-cast scale. The Lamborghini Huracán features metallic gold-lime paintwork, precision-molded aerodynamic splitters, detailed interior cockpit, and a black presentation plinth.",
          weight: 210,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/prod-lamborghini-huracan.jpg`,
          images: [
            { url: `${STOREFRONT_URL}/images/prod-lamborghini-huracan.jpg` },
            { url: `${STOREFRONT_URL}/images/col-supercars.jpg` },
          ],
          metadata: {
            scale: "1:64",
            brand: "Mini GT / iMotora",
            material: "Die-Cast Metal & Rubber Tires",
            featured_rank: 4,
            collection_tags: "supercars,featured",
          },
          options: [
            { title: "Scale", values: ["1:64 Scale", "1:43 Scale"] },
          ],
          variants: [
            {
              title: "1:64 Scale",
              sku: "IMT-LAM-HUR-64",
              options: { Scale: "1:64 Scale" },
              prices: [
                { amount: 1999, currency_code: "inr" },
                { amount: 24, currency_code: "usd" },
              ],
            },
            {
              title: "1:43 Scale",
              sku: "IMT-LAM-HUR-43",
              options: { Scale: "1:43 Scale" },
              prices: [
                { amount: 3299, currency_code: "inr" },
                { amount: 39, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Mini Garage Display (5 Cars)",
          subtitle: "Dust-Proof Acrylic • USB LED Lighting",
          handle: "mini-garage-display-5-cars",
          category_ids: [catId("display-garage")],
          collection_id: colId("featured"),
          description:
            "Showcase your prized 1:64 models in museum-grade clarity. Features a matte-black architectural frame, crystal-clear sliding acrylic front panel, built-in warm white USB-C LED roof strips, and parking bay graphics for 5+ cars.",
          weight: 680,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/prod-mini-garage.jpg`,
          images: [
            { url: `${STOREFRONT_URL}/images/prod-mini-garage.jpg` },
            { url: `${STOREFRONT_URL}/images/cat-display.jpg` },
          ],
          metadata: {
            scale: "Fits 1:64 Scale",
            brand: "iMotora Display Solutions",
            material: "Optical Acrylic & Matte ABS",
            featured_rank: 5,
            collection_tags: "imotora-originals,featured",
          },
          options: [{ title: "Capacity", values: ["5-Car Mini Garage", "12-Car Double Tower"] }],
          variants: [
            {
              title: "5-Car Mini Garage",
              sku: "IMT-DSP-GAR-5",
              options: { Capacity: "5-Car Mini Garage" },
              prices: [
                { amount: 1499, currency_code: "inr" },
                { amount: 18, currency_code: "usd" },
              ],
            },
            {
              title: "12-Car Double Tower",
              sku: "IMT-DSP-GAR-12",
              options: { Capacity: "12-Car Double Tower" },
              prices: [
                { amount: 2699, currency_code: "inr" },
                { amount: 32, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Porsche 911 GT3 RS — iMotora Originals Edition",
          subtitle: "Racing Yellow • Limited Numbered Run (500 pcs)",
          handle: "porsche-911-gt3-rs-originals",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("imotora-originals"),
          description:
            "An iMotora Originals exclusive. Precision-engineered 1:43 scale Porsche 911 GT3 RS in Racing Yellow with satin-black forged wheels, swan-neck carbon rear wing, perforated brake discs, and custom iMotora collector box.",
          weight: 340,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/originals-porsche.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/originals-porsche.jpg` }],
          metadata: {
            scale: "1:43",
            brand: "iMotora Originals",
            material: "Heavyweight Die-Cast Alloy",
            compare_at_price_inr: 3299,
            discount_badge: "EXCLUSIVE",
            is_preorder: true,
            preorder_deposit_percent: 50,
            preorder_release_date: "2026-12-20",
            preorder_note: "Reserve with a 50% deposit today. Pay the remaining 50% balance right before dispatch.",
          },
          options: [{ title: "Scale", values: ["1:43 Scale", "1:18 Scale"] }],
          variants: [
            {
              title: "1:43 Scale",
              sku: "IMT-ORG-P911-43",
              options: { Scale: "1:43 Scale" },
              prices: [
                { amount: 2799, currency_code: "inr" },
                { amount: 34, currency_code: "usd" },
              ],
            },
            {
              title: "1:18 Scale",
              sku: "IMT-ORG-P911-18",
              options: { Scale: "1:18 Scale" },
              prices: [
                { amount: 7999, currency_code: "inr" },
                { amount: 95, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Formula 1 Grand Prix 1:43 Diecast Racer",
          subtitle: "Championship Livery • Acrylic Helmet Display",
          handle: "f1-grand-prix-1-43-racer",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("motorsport"),
          description:
            "Capture the thrill of Sunday race day with this 1:43 scale Formula 1 championship die-cast model. Authentic aero wings, halo cockpit protection, Pirelli soft-compound slicks, and detailed driver helmet.",
          weight: 280,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/col-motorsport.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/col-motorsport.jpg` }],
          metadata: {
            scale: "1:43",
            brand: "Bburago F1 Official",
            material: "Die-Cast Metal & Rubber",
            is_preorder: true,
            preorder_deposit_percent: 50,
            preorder_release_date: "2026-12-20",
            preorder_note: "Reserve with a 50% deposit today. Pay the remaining 50% balance right before dispatch.",
          },
          options: [{ title: "Edition", values: ["Standard Showcase", "With Driver Figure"] }],
          variants: [
            {
              title: "Standard Showcase",
              sku: "IMT-F1-GP43-STD",
              options: { Edition: "Standard Showcase" },
              prices: [
                { amount: 2499, currency_code: "inr" },
                { amount: 30, currency_code: "usd" },
              ],
            },
            {
              title: "With Driver Figure",
              sku: "IMT-F1-GP43-DRV",
              options: { Edition: "With Driver Figure" },
              prices: [
                { amount: 2999, currency_code: "inr" },
                { amount: 36, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "1967 Classic GT Berlinetta 1:43 Collector Edition",
          subtitle: "Cherry Heritage Red • Wire-Spoke Wheels",
          handle: "1967-classic-gt-berlinetta",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("classics"),
          description:
            "A timeless icon of golden-era grand touring. Finished in deep Cherry Heritage Red with chrome bumpers, multi-spoke wire wheels, tan leather-look interior, and crystal headlamp lenses.",
          weight: 310,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/col-classics.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/col-classics.jpg` }],
          metadata: {
            scale: "1:43",
            brand: "iMotora Heritage Classics",
            material: "Die-Cast Metal & Chrome Trim",
          },
          options: [{ title: "Scale", values: ["1:43 Scale"] }],
          variants: [
            {
              title: "1:43 Scale",
              sku: "IMT-CLS-GT67-43",
              options: { Scale: "1:43 Scale" },
              prices: [
                { amount: 2299, currency_code: "inr" },
                { amount: 28, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Ferrari Roma Metallic Blue 1:43 Showcase Model",
          subtitle: "Blu Tour de France • Opening Doors",
          handle: "ferrari-roma-metallic-blue",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("supercars"),
          description:
            "La Nuova Dolce Vita in miniature form. Sculpted in metallic Blu Tour de France with diamond-cut alloy wheels, detailed quad exhausts, and opening doors revealing a saddle-tan cockpit.",
          weight: 290,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/cat-diecast.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/cat-diecast.jpg` }],
          metadata: {
            scale: "1:43",
            brand: "Bburago Signature",
            material: "Die-Cast Alloy",
            compare_at_price_inr: 2999,
            discount_badge: "17% OFF",
            is_preorder: true,
            preorder_deposit_percent: 50,
            preorder_release_date: "2026-12-20",
            preorder_note: "Reserve with a 50% deposit today. Pay the remaining 50% balance right before dispatch.",
          },
          options: [{ title: "Scale", values: ["1:43 Scale", "1:64 Scale"] }],
          variants: [
            {
              title: "1:43 Scale",
              sku: "IMT-FER-ROM-43",
              options: { Scale: "1:43 Scale" },
              prices: [
                { amount: 2499, currency_code: "inr" },
                { amount: 30, currency_code: "usd" },
              ],
            },
            {
              title: "1:64 Scale",
              sku: "IMT-FER-ROM-64",
              options: { Scale: "1:64 Scale" },
              prices: [
                { amount: 1599, currency_code: "inr" },
                { amount: 19, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "Subaru Impreza WRX STI Rally Legend 1:64",
          subtitle: "World Rally Blue • Gold Gravel Wheels",
          handle: "subaru-impreza-wrx-rally-legend",
          category_ids: [catId("diecast-cars")],
          collection_id: colId("racing-legends"),
          description:
            "Celebrate rally heritage with the iconic World Rally Blue Subaru Impreza WRX STI. Complete with mud flaps, roof scoop, gold 6-spoke rally wheels, and authentic championship decals.",
          weight: 180,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/col-rally.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/col-rally.jpg` }],
          metadata: {
            scale: "1:64",
            brand: "Tarmac Works / iMotora",
            material: "Die-Cast Metal",
            is_preorder: true,
            preorder_deposit_percent: 50,
            preorder_release_date: "2026-12-20",
            preorder_note: "Reserve with a 50% deposit today. Pay the remaining 50% balance right before dispatch.",
          },
          options: [{ title: "Scale", values: ["1:64 Scale"] }],
          variants: [
            {
              title: "1:64 Scale",
              sku: "IMT-RAL-WRX-64",
              options: { Scale: "1:64 Scale" },
              prices: [
                { amount: 1599, currency_code: "inr" },
                { amount: 19, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "LED Acrylic 4-Car Collector Showcase Box",
          subtitle: "Stackable Dust-Free Museum Case",
          handle: "led-acrylic-4-car-showcase",
          category_ids: [catId("display-garage")],
          collection_id: colId("imotora-originals"),
          description:
            "Crystal-clear 3mm optical acrylic showcase designed to protect and illuminate up to 4 scale models (1:64) or 1 large 1:18 centerpiece. Stackable magnetic design keeps dust away permanently.",
          weight: 520,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/cat-display.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/cat-display.jpg` }],
          metadata: {
            scale: "Universal 1:64 / 1:43",
            brand: "iMotora Display Solutions",
            material: "3mm Optical Acrylic",
          },
          options: [{ title: "Finish", values: ["Clear + Black Base", "Clear + Mirror Base"] }],
          variants: [
            {
              title: "Clear + Black Base",
              sku: "IMT-DSP-ACR-BLK",
              options: { Finish: "Clear + Black Base" },
              prices: [
                { amount: 1899, currency_code: "inr" },
                { amount: 23, currency_code: "usd" },
              ],
            },
            {
              title: "Clear + Mirror Base",
              sku: "IMT-DSP-ACR-MIR",
              options: { Finish: "Clear + Mirror Base" },
              prices: [
                { amount: 2199, currency_code: "inr" },
                { amount: 26, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
        {
          title: "iMotora Metal Supercar Keychain — Rosso Red",
          subtitle: "Zinc-Alloy Die-Cast • Brushed Steel Ring",
          handle: "imotora-metal-supercar-keychain",
          category_ids: [catId("collector-accessories")],
          collection_id: colId("imotora-originals"),
          description:
            "Carry your passion everywhere. Solid zinc-alloy miniature supercar keychain coated in automotive Rosso Red enamel with a heavy-duty brushed steel split ring.",
          weight: 85,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfile.id,
          thumbnail: `${STOREFRONT_URL}/images/cat-accessories.jpg`,
          images: [{ url: `${STOREFRONT_URL}/images/cat-accessories.jpg` }],
          metadata: {
            scale: "Miniature Accessory",
            brand: "iMotora Originals",
            material: "Zinc Alloy & Brushed Steel",
          },
          options: [{ title: "Color", values: ["Rosso Red", "Matte Carbon Black"] }],
          variants: [
            {
              title: "Rosso Red",
              sku: "IMT-ACC-KEY-RED",
              options: { Color: "Rosso Red" },
              prices: [
                { amount: 499, currency_code: "inr" },
                { amount: 6, currency_code: "usd" },
              ],
            },
            {
              title: "Matte Carbon Black",
              sku: "IMT-ACC-KEY-BLK",
              options: { Color: "Matte Carbon Black" },
              prices: [
                { amount: 499, currency_code: "inr" },
                { amount: 6, currency_code: "usd" },
              ],
            },
          ],
          sales_channels: [{ id: defaultSalesChannel[0].id }],
        },
      ],
    },
  });
  logger.info("Finished seeding iMotora products!");

  logger.info("Seeding inventory levels...");
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  });

  const inventoryLevels: CreateInventoryLevelInput[] = inventoryItems.map(
    (inventoryItem) => ({
      location_id: stockLocation.id,
      stocked_quantity: 100,
      inventory_item_id: inventoryItem.id,
    })
  );

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: inventoryLevels,
    },
  });

  logger.info("✅ iMotora Medusa v2 catalog seed complete!");
}
