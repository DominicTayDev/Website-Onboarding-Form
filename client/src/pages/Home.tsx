import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, X, CloudUpload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface Product {
  id: number;
  name: string;
  desc: string;
  price: string;
}

/**
 * WordPress Site Builder Onboarding Form
 * 
 * Design Philosophy: Professional, clean, and accessible
 * - Color scheme: Purple (#534AB7) as primary, teal as accent
 * - Typography: DM Serif Display for headings, DM Sans for body
 * - Layout: Multi-section form with clear visual hierarchy
 * - Interaction: Smooth transitions and immediate feedback
 */
export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [prodCount, setProdCount] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [formData, setFormData] = useState({
    company_name: "",
    uen: "",
    company_address: "",
    rep_name: "",
    rep_email: "",
    rep_phone: "",
    business_description: "",
    company_logo: "",
    competitor_1: "",
    competitor_2: "",
    competitor_3: "",
    competitor_4: "",
    competitor_5: "",
  });

  // Initialize 5 products on mount
  useEffect(() => {
    const initialProducts: Product[] = [];
    for (let i = 0; i < 5; i++) {
      initialProducts.push({
        id: i + 1,
        name: "",
        desc: "",
        price: "",
      });
    }
    setProducts(initialProducts);
    setProdCount(5);
  }, []);

  const addProduct = () => {
    const newId = Math.max(...products.map((p) => p.id), 0) + 1;
    setProducts([
      ...products,
      { id: newId, name: "", desc: "", price: "" },
    ]);
    setProdCount(prodCount + 1);
  };

  const removeProduct = (id: number) => {
    setProducts(products.filter((p) => p.id !== id));
    setProdCount(prodCount - 1);
  };

  const updateProduct = (id: number, field: keyof Product, value: string) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, [field]: value } : p
      )
    );
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "business_description") {
      const words = value.trim().split(/\s+/).filter((w) => w).length;
      setWordCount(words);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (products.length < 5) {
      toast.error("Please add at least 5 products before submitting.");
      return;
    }

    setSubmitting(true);

    try {
      const data = {
        ...formData,
        products_json: JSON.stringify(products),
      };

      const response = await fetch(
        "https://script.google.com/macros/s/AKfycbz4-INKF120HM7iKWvimH9lHq7rD6sJ7SJO8TOzwfp52SYZVTZgogOd_iRw0As20xbwg/exec",
        {
          method: "POST",
          mode: "no-cors",
          body: JSON.stringify(data),
          headers: { "Content-Type": "application/json" },
        }
      );

      setSubmitted(true);
      toast.success("Submission received! We'll be in touch within 1 business day.");
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong. Please try again or contact us directly.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center border-0 shadow-lg">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Submission Received!
          </h2>
          <p className="text-gray-600 mb-6">
            Thank you! We've received your details and will be in touch within 1 business day to begin your WordPress site.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            Submit Another
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-3">
          <div className="w-9 h-9 bg-purple-600 rounded-lg flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              WordPress Site Builder
            </h1>
            <p className="text-xs text-gray-500">5-Page Site · E-commerce Ready</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        {/* Intro */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900 mb-3">
            Let's build your WordPress site
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Fill in your details below. Once submitted, we'll begin building your 5-page site with Home, Contact Us, and Shopping pages.
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              Home
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              Contact us
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
              Shopping
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              About
            </span>
            <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-full">
              Gallery / FAQ
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Company Info */}
          <Card className="border-0 shadow-md p-6">
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Company information</h3>
                <p className="text-sm text-gray-500">
                  Your business details for the website
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="company_name" className="text-sm font-medium">
                    Company name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="company_name"
                    name="company_name"
                    placeholder="e.g. Acme Pte Ltd"
                    value={formData.company_name}
                    onChange={handleFormChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="uen" className="text-sm font-medium">
                    UEN <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="uen"
                    name="uen"
                    placeholder="e.g. 202312345A"
                    value={formData.uen}
                    onChange={handleFormChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="company_address" className="text-sm font-medium">
                  Company address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="company_address"
                  name="company_address"
                  placeholder="e.g. 10 Anson Road, #10-01, Singapore 079903"
                  value={formData.company_address}
                  onChange={handleFormChange}
                  required
                  className="mt-1"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="rep_name" className="text-sm font-medium">
                    Representative name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rep_name"
                    name="rep_name"
                    placeholder="Full name"
                    value={formData.rep_name}
                    onChange={handleFormChange}
                    required
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="rep_email" className="text-sm font-medium">
                    Representative email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="rep_email"
                    name="rep_email"
                    type="email"
                    placeholder="name@company.com"
                    value={formData.rep_email}
                    onChange={handleFormChange}
                    required
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="rep_phone" className="text-sm font-medium">
                  Representative phone <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="rep_phone"
                  name="rep_phone"
                  type="tel"
                  placeholder="e.g. +65 9123 4567"
                  value={formData.rep_phone}
                  onChange={handleFormChange}
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label
                  htmlFor="business_description"
                  className="text-sm font-medium"
                >
                  Brief description of your business{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="business_description"
                  name="business_description"
                  placeholder="Tell us what your business does, who you serve, and what makes you unique. Keep it under 100 words."
                  value={formData.business_description}
                  onChange={handleFormChange}
                  required
                  className="mt-1 resize-none"
                />
                <div
                  className={`text-xs mt-2 text-right ${
                    wordCount > 100 ? "text-red-500" : "text-gray-500"
                  }`}
                >
                  {wordCount} / 100 words
                </div>
              </div>

              <div>
                <Label htmlFor="company_logo" className="text-sm font-medium">
                  Company logo <span className="text-red-500">*</span>
                </Label>
                <label
                  htmlFor="company_logo"
                  className="mt-2 block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition-colors"
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.add("border-purple-400", "bg-purple-50");
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("border-purple-400", "bg-purple-50");
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("border-purple-400", "bg-purple-50");
                    const file = e.dataTransfer.files?.[0];
                    if (file && file.type.startsWith("image/")) {
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setFormData((prev) => ({
                          ...prev,
                          company_logo: event.target?.result as string,
                        }));
                      };
                      reader.readAsDataURL(file);
                    } else {
                      toast.error("Please upload an image file");
                    }
                  }}
                >
                  {formData.company_logo ? (
                    <div className="flex flex-col items-center gap-3">
                      <img
                        src={formData.company_logo}
                        alt="Company logo preview"
                        className="h-20 w-auto rounded border border-gray-200"
                      />
                      <p className="text-sm text-gray-600">Click or drag to change logo</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-3">
                      <CloudUpload className="w-10 h-10 text-gray-400" />
                      <div>
                        <p className="text-gray-700 font-medium">Click to upload your logo</p>
                        <p className="text-xs text-gray-500 mt-1">PNG, JPG, SVG — max 5MB</p>
                      </div>
                    </div>
                  )}
                  <Input
                    id="company_logo"
                    name="company_logo"
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (file.size > 5 * 1024 * 1024) {
                          toast.error("File size must be less than 5MB");
                          return;
                        }
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setFormData((prev) => ({
                            ...prev,
                            company_logo: event.target?.result as string,
                          }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    required
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </Card>

          {/* Section 2: Products */}
          <Card className="border-0 shadow-md p-6">
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Product listings</h3>
                <p className="text-sm text-gray-500">
                  Minimum 5 products required for your e-commerce shop
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {products.map((product, idx) => (
                <Card key={product.id} className="bg-gray-50 p-4 border border-gray-200">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-bold bg-teal-100 text-teal-700 px-2 py-1 rounded">
                      Product {idx + 1}
                    </span>
                    {products.length > 5 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="text-red-500 hover:text-red-700 text-sm font-medium flex items-center gap-1"
                      >
                        <X className="w-3 h-3" /> Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    <div>
                      <Label className="text-xs font-medium">
                        Product name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. Signature Candle Set"
                        value={product.name}
                        onChange={(e) =>
                          updateProduct(product.id, "name", e.target.value)
                        }
                        required
                        className="mt-1 text-sm"
                      />
                    </div>
                    <div>
                      <Label className="text-xs font-medium">
                        Price (SGD) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        placeholder="e.g. 28.90"
                        value={product.price}
                        onChange={(e) =>
                          updateProduct(product.id, "price", e.target.value)
                        }
                        required
                        className="mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs font-medium">
                      Product description <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      placeholder="Describe materials, use case, variants..."
                      value={product.desc}
                      onChange={(e) =>
                        updateProduct(product.id, "desc", e.target.value)
                      }
                      required
                      className="mt-1 text-sm resize-none"
                      style={{ minHeight: "65px" }}
                    />
                  </div>
                </Card>
              ))}
            </div>

            <Button
              type="button"
              onClick={addProduct}
              variant="outline"
              className="w-full mt-4 border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add another product
            </Button>

            <div className="mt-3 text-center text-sm">
              {products.length < 5 ? (
                <span className="text-red-500 font-medium">
                  {products.length} of 5 added — please add{" "}
                  {5 - products.length} more product
                  {5 - products.length !== 1 ? "s" : ""}
                </span>
              ) : (
                <span className="text-teal-600 font-medium">
                  ✓ {products.length} products added
                </span>
              )}
            </div>
          </Card>

          {/* Section 3: Competitors */}
          <Card className="border-0 shadow-md p-6">
            <div className="flex gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Competitor websites</h3>
                <p className="text-sm text-gray-500">
                  Up to 5 URLs — used for design and feature inspiration
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <div key={num} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">
                    {num}
                  </span>
                  <Input
                    type="url"
                    name={`competitor_${num}`}
                    placeholder="https://competitor.com"
                    value={
                      formData[`competitor_${num}` as keyof typeof formData]
                    }
                    onChange={handleFormChange}
                    className="flex-1"
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Submit */}
          <Card className="border-0 shadow-md p-8 text-center">
            <p className="text-gray-600 mb-6">
              Once submitted, we'll review your details and begin building your
              5-page WordPress site. You'll receive a confirmation email within 1
              business day.
            </p>
            <Button
              type="submit"
              disabled={submitting || products.length < 5}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 px-8"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                    />
                  </svg>
                  Submit &amp; generate my site
                </>
              )}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  );
}
