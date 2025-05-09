import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useClient,
  useCreateClient,
  useUpdateClient,
} from "@/lib/hooks/useApi";
import { PageHeader } from "@/components/ui/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ClientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  preferredCommunication: "email" | "phone" | "sms";
}

interface ClientFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  preferredCommunication?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
}

const initialFormData: ClientFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: {
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
  },
  preferredCommunication: "email",
};

export function ClientForm() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { data: client, isLoading: isLoadingClient } = useClient(id || "");
  const createClient = useCreateClient();
  const updateClient = useUpdateClient();

  const [formData, setFormData] =
    React.useState<ClientFormData>(initialFormData);
  const [errors, setErrors] = React.useState<ClientFormErrors>({});

  React.useEffect(() => {
    if (client) {
      setFormData({
        firstName: client.firstName,
        lastName: client.lastName,
        email: client.email,
        phone: client.phone,
        address: client.address || {
          street: "",
          city: "",
          state: "",
          country: "",
          postalCode: "",
        },
        preferredCommunication: client.preferredCommunication,
      });
    }
  }, [client]);

  const validateForm = () => {
    const newErrors: ClientFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone is required";
    }

    if (!formData.address.street.trim()) {
      newErrors.address = {
        ...newErrors.address,
        street: "Street is required",
      };
    }

    if (!formData.address.city.trim()) {
      newErrors.address = { ...newErrors.address, city: "City is required" };
    }

    if (!formData.address.state.trim()) {
      newErrors.address = { ...newErrors.address, state: "State is required" };
    }

    if (!formData.address.postalCode.trim()) {
      newErrors.address = {
        ...newErrors.address,
        postalCode: "Postal code is required",
      };
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const now = new Date().toISOString();
      const clientData = {
        ...formData,
        lastVisit: isEditing ? client?.lastVisit || now : now,
        createdAt: isEditing ? client?.createdAt || now : now,
        updatedAt: now,
      };

      if (isEditing && id) {
        await updateClient.mutateAsync({ id, data: clientData });
      } else {
        await createClient.mutateAsync(clientData);
      }
      toast({
        title: "Success",
        description: isEditing
          ? "Client updated successfully"
          : "Client created successfully",
      });
      navigate("/clients");
    } catch (error) {
      toast({
        title: "Error",
        description: isEditing
          ? "Failed to update client"
          : "Failed to create client",
        variant: "destructive",
      });
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    // Clear error when user starts typing
    if (errors[name as keyof ClientFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      preferredCommunication: value as "email" | "phone" | "sms",
    }));
  };

  if (isLoadingClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 space-y-4">
      <PageHeader
        title={isEditing ? "Edit Client" : "Add New Client"}
        description={
          isEditing ? "Update client information" : "Create a new client record"
        }
      >
        <Button
          variant="outline"
          onClick={() => navigate("/clients")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Clients
        </Button>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Client Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className={errors.firstName ? "border-red-500" : ""}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className={errors.lastName ? "border-red-500" : ""}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="preferredCommunication">
                  Preferred Communication
                </Label>
                <Select
                  value={formData.preferredCommunication}
                  onValueChange={handleSelectChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select preferred communication" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="email">Email</SelectItem>
                    <SelectItem value="phone">Phone</SelectItem>
                    <SelectItem value="sms">SMS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Address</h3>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="address.street">Street</Label>
                  <Input
                    id="address.street"
                    name="address.street"
                    value={formData.address.street}
                    onChange={handleChange}
                    className={errors.address?.street ? "border-red-500" : ""}
                  />
                  {errors.address?.street && (
                    <p className="text-sm text-red-500">
                      {errors.address.street}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.city">City</Label>
                  <Input
                    id="address.city"
                    name="address.city"
                    value={formData.address.city}
                    onChange={handleChange}
                    className={errors.address?.city ? "border-red-500" : ""}
                  />
                  {errors.address?.city && (
                    <p className="text-sm text-red-500">
                      {errors.address.city}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.state">State</Label>
                  <Input
                    id="address.state"
                    name="address.state"
                    value={formData.address.state}
                    onChange={handleChange}
                    className={errors.address?.state ? "border-red-500" : ""}
                  />
                  {errors.address?.state && (
                    <p className="text-sm text-red-500">
                      {errors.address.state}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address.postalCode">Postal Code</Label>
                  <Input
                    id="address.postalCode"
                    name="address.postalCode"
                    value={formData.address.postalCode}
                    onChange={handleChange}
                    className={
                      errors.address?.postalCode ? "border-red-500" : ""
                    }
                  />
                  {errors.address?.postalCode && (
                    <p className="text-sm text-red-500">
                      {errors.address.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/clients")}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createClient.isPending || updateClient.isPending}
              >
                {isEditing ? "Update Client" : "Create Client"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
