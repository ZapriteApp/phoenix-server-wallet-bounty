<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\CoreExtension;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* payment/index.html.twig */
class __TwigTemplate_2c05af6b1b22e19d09a2673ae113859c extends Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->blocks = [
            'title' => [$this, 'block_title'],
            'body' => [$this, 'block_body'],
        ];
    }

    protected function doGetParent(array $context)
    {
        // line 2
        return "base.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "template", "payment/index.html.twig"));

        $this->parent = $this->loadTemplate("base.html.twig", "payment/index.html.twig", 2);
        yield from $this->parent->unwrap()->yield($context, array_merge($this->blocks, $blocks));
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

    }

    // line 4
    public function block_title($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "title"));

        yield "Receive";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    // line 6
    public function block_body($context, array $blocks = [])
    {
        $macros = $this->macros;
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f = $this->extensions["Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension"];
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->enter($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof = new \Twig\Profiler\Profile($this->getTemplateName(), "block", "body"));

        // line 7
        yield "<div class=\"home-container\">
    <h1 class=\"page-title\">Receive</h1>
    <h2 class=\"section-title\">Bolt 11</h2>
    <h2 class=\"sub-section-title\">Generate Invoice Bolt 11</h2>
    <div class=\"container\">
      ";
        // line 12
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 12, $this->source); })()), 'form_start');
        yield "
          <div class=\"form-group\">
              ";
        // line 14
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 14, $this->source); })()), "amount", [], "any", false, false, false, 14), 'widget');
        yield "
          </div>
          <div class=\"form-group\">
              ";
        // line 17
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 17, $this->source); })()), "description", [], "any", false, false, false, 17), 'widget');
        yield "
          </div>
          <div class=\"form-group\">
              ";
        // line 20
        yield $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->searchAndRenderBlock(CoreExtension::getAttribute($this->env, $this->source, (isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 20, $this->source); })()), "submit", [], "any", false, false, false, 20), 'widget');
        yield "
          </div>
      ";
        // line 22
        yield         $this->env->getRuntime('Symfony\Component\Form\FormRenderer')->renderBlock((isset($context["form"]) || array_key_exists("form", $context) ? $context["form"] : (function () { throw new RuntimeError('Variable "form" does not exist.', 22, $this->source); })()), 'form_end');
        yield "
      ";
        // line 23
        if (array_key_exists("payment_result", $context)) {
            // line 24
            yield "        <div class=\"result-container mt-4\">
            <h2>Invoice</h2>
            <div class=\"result-content\">
                <p><strong>Amount:</strong> ";
            // line 27
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["payment_result"]) || array_key_exists("payment_result", $context) ? $context["payment_result"] : (function () { throw new RuntimeError('Variable "payment_result" does not exist.', 27, $this->source); })()), "amountSat", [], "any", false, false, false, 27), "html", null, true);
            yield "</p>
                <p><strong>Payment Hash:</strong> ";
            // line 28
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["payment_result"]) || array_key_exists("payment_result", $context) ? $context["payment_result"] : (function () { throw new RuntimeError('Variable "payment_result" does not exist.', 28, $this->source); })()), "paymentHash", [], "any", false, false, false, 28), "html", null, true);
            yield "</p>
                <div class=\"copy-bar\">
            \t     <span class=\"copy-text-12\">";
            // line 30
            yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape(CoreExtension::getAttribute($this->env, $this->source, (isset($context["payment_result"]) || array_key_exists("payment_result", $context) ? $context["payment_result"] : (function () { throw new RuntimeError('Variable "payment_result" does not exist.', 30, $this->source); })()), "serialized", [], "any", false, false, false, 30), "html", null, true);
            yield "</span>
            \t     <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-12')\">Copy Text</button>
                </div>
            </div>
        </div>
      ";
        }
        // line 36
        yield "   </div>
    <h2 class=\"balance-title\">Bolt 12</h2>
    <p>This is your node's Bolt 12 offer. A static and reusable payment request that does not expire.</p>
    <div class=\"copy-bar\">
        <span class=\"copy-text-11\">";
        // line 40
        yield $this->env->getRuntime('Twig\Runtime\EscaperRuntime')->escape((isset($context["offer"]) || array_key_exists("offer", $context) ? $context["offer"] : (function () { throw new RuntimeError('Variable "offer" does not exist.', 40, $this->source); })()), "html", null, true);
        yield "</span>
        <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-11')\">Copy Text</button>
    </div>
</div>
";
        
        $__internal_6f47bbe9983af81f1e7450e9a3e3768f->leave($__internal_6f47bbe9983af81f1e7450e9a3e3768f_prof);

        return; yield '';
    }

    /**
     * @codeCoverageIgnore
     */
    public function getTemplateName()
    {
        return "payment/index.html.twig";
    }

    /**
     * @codeCoverageIgnore
     */
    public function isTraitable()
    {
        return false;
    }

    /**
     * @codeCoverageIgnore
     */
    public function getDebugInfo()
    {
        return array (  139 => 40,  133 => 36,  124 => 30,  119 => 28,  115 => 27,  110 => 24,  108 => 23,  104 => 22,  99 => 20,  93 => 17,  87 => 14,  82 => 12,  75 => 7,  68 => 6,  54 => 4,  37 => 2,);
    }

    public function getSourceContext()
    {
        return new Source("{# templates/payment/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Receive{% endblock %}

{% block body %}
<div class=\"home-container\">
    <h1 class=\"page-title\">Receive</h1>
    <h2 class=\"section-title\">Bolt 11</h2>
    <h2 class=\"sub-section-title\">Generate Invoice Bolt 11</h2>
    <div class=\"container\">
      {{ form_start(form) }}
          <div class=\"form-group\">
              {{ form_widget(form.amount) }}
          </div>
          <div class=\"form-group\">
              {{ form_widget(form.description) }}
          </div>
          <div class=\"form-group\">
              {{ form_widget(form.submit) }}
          </div>
      {{ form_end(form) }}
      {% if payment_result is defined %}
        <div class=\"result-container mt-4\">
            <h2>Invoice</h2>
            <div class=\"result-content\">
                <p><strong>Amount:</strong> {{ payment_result.amountSat }}</p>
                <p><strong>Payment Hash:</strong> {{ payment_result.paymentHash }}</p>
                <div class=\"copy-bar\">
            \t     <span class=\"copy-text-12\">{{ payment_result.serialized }}</span>
            \t     <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-12')\">Copy Text</button>
                </div>
            </div>
        </div>
      {% endif %}
   </div>
    <h2 class=\"balance-title\">Bolt 12</h2>
    <p>This is your node's Bolt 12 offer. A static and reusable payment request that does not expire.</p>
    <div class=\"copy-bar\">
        <span class=\"copy-text-11\">{{ offer }}</span>
        <button class=\"btn-copy\" onclick=\"copyToClipboard('.copy-text-11')\">Copy Text</button>
    </div>
</div>
{% endblock %}
", "payment/index.html.twig", "/var/www/symfony_docker/templates/payment/index.html.twig");
    }
}
