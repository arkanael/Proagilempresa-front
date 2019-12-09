import localePt from '@angular/common/locales/pt';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Produto } from '../_models/Produto';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { ProdutoService } from '../_services/produto.service';
import { registerLocaleData } from '@angular/common';
import { ptBrLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';


registerLocaleData(localePt);
defineLocale('pt-br', ptBrLocale);

@Component({
  selector: 'app-produto',
  templateUrl: './produto.component.html',
  styleUrls: ['./produto.component.css']
})

export class ProdutoComponent implements OnInit {


    titulo = 'Produtos';
    produtos: Produto[];
    empresaproduto: Produto;
    modoSalva = '';
    registerForm: FormGroup;
    _produtosFiltrados: Produto[];
    _filtroLista: string;
    headerTextDelete = '';
    produto : Produto;
    file : File;

    constructor(private produtoService: ProdutoService,
                private formBuilder: FormBuilder,
                private localeService: BsLocaleService,
                private toastr: ToastrService) {
      this.localeService.use('pt-br');
    }
    get filtroLista(): string {
      return this._filtroLista;
    }
    set filtroLista(value: string) {
      this._filtroLista = value;
      this.empresasFiltrados = this.filtroLista ? this.filtrarProduto(this.filtroLista) : this.produtos;
    }
    get empresasFiltrados(): Produto[] {
      return this._produtosFiltrados ? this._produtosFiltrados : this.produtos ;
    }
    set empresasFiltrados(value: Produto[]) {
      this._produtosFiltrados = value;
    }
    ngOnInit() {
      this.validation();
      this.getProduto();
    }
    openModal(template: any) {
      this.registerForm.reset();
      template.show();
    }
    filtrarProduto(filtroLista: string): Produto[] {
      filtroLista = filtroLista.toLocaleLowerCase();
      return this.produtos.filter(produto => produto.nome.toLocaleLowerCase().indexOf(filtroLista) !== -1);
    }
    getProduto() {
      this.produtoService.ObterTodos().subscribe(
        (empres: Produto[]) => {
          this.produtos = empres;
        },
        error => {
          console.log(error);
          this.toastr.error(`Ocorreu um erro ao carregar produto: ${error.error}`);
        }
      );
    }
       salvarAlteracao(template: any) {
      if (this.registerForm.valid) {
        this.pesistirProduto().subscribe(
          (produto: Produto) => {
            this.produtoService.ObterTodos().subscribe(
              () => {
                template.hide();
                this.getProduto();
                this.toastr.success('Produto salvo com sucesso!');
              },
              error => {
                this.toastr.error(`Ocorreu um erro ao tentar salvar Produto: ${error.error}`);
              }
            );
          },
          error => {
            this.toastr.error(`Ocorreu um erro ao tentar salvar produto: ${error.error}`);
          }
        );
      }
    }
    pesistirProduto() {
      if (this.modoSalva === 'put') {
        this.produtos = Object.assign({id: this.produto.id}, this.registerForm.value);
        return this.produtoService.putProduto(this.produto);
      } else if (this.modoSalva === 'post') {
        this.produtos = Object.assign({}, this.registerForm.value);
        return this.produtoService.postProduto(this.produto);
      }
    }
    novoProduto(template: any) {
      this.modoSalva = 'post';
      this.openModal(template);
    }
    editarProduto(produto: Produto, template: any) {
      this.modoSalva = 'put';
      this.openModal(template);
      this.produto = Object.assign({}, produto);
      this.registerForm.patchValue(this.produtos);
    }
    excluirProduto(produto: Produto, confirm: any) {
      this.headerTextDelete = produto.nome;
      confirm.show();
      this.produto = produto;
    }
    confirmaExclusao(confirm: any) {
      this.produtoService.deleteProduo(this.produto.id).subscribe(
        () => {
          confirm.hide();
          this.getProduto();
          this.toastr.success('Produto excluido com sucesso!');
        },
        (error) => {
          this.toastr.error(`Ocorreu um erro ao tentar excluir a Produto: ${error.error}`);
        }
      );
    }
    validation() {
      this.registerForm = this.formBuilder.group({
        nome: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(1200)]],
        valor: ['', Validators.required],
        qtdeItens: ['', [Validators.required, Validators.max(120000)]],
      });
    }
    onFileChange(produt: any) {
      if (produt.target.files && produt.target.files.length) {
        this.file = produt.target.files;
      }
    }
    getControl(nomeControl: string): AbstractControl {
      return this.registerForm.get(nomeControl);
    }
    isFormControlInvalid(nomeControl: string): boolean {
      const control = this.getControl(nomeControl);
      return control.invalid && (control.dirty || control.touched);
    }
    isFormControlRequired(nomeControl: string): boolean {
      return this.getControl(nomeControl).hasError('required');
    }
    isFormControlMinLength(nomeControl: string): boolean {
      return this.getControl(nomeControl).hasError('minlength');
    }
    isFormControlMaxLength(nomeControl: string): boolean {
      return this.getControl(nomeControl).hasError('maxlength');
    }
    isFormControlMax(nomeControl: string): boolean {
      return this.getControl(nomeControl).hasError('max');
    }

  }
